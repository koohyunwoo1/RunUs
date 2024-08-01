package runus.runus.webSocket.service;

import org.springframework.data.geo.Point;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.webSocket.Entity.PartyEntity;
import runus.runus.webSocket.Entity.PartyMemberEntity;
import runus.runus.webSocket.dto.PartyRequestDto;
import runus.runus.webSocket.repository.PartyMemberRepository;
import runus.runus.webSocket.repository.PartyRepository;
import runus.runus.webSocket.repository.QuotesRepository;
import runus.runus.webSocket.dto.ChatRoom;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {
    private final ObjectMapper objectMapper;
    private Map<String, ChatRoom> chatRooms;

    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private QuotesRepository quotesRepository;

    @Autowired
    private PartyMemberRepository partyMemberRepository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
    }

    public ChatRoom findRoomById(String roomId){
        return chatRooms.get(roomId);
    }

    @Override
    public ChatRoom createRoom(PartyRequestDto partyRequestDto, String userName){
        String randomId = UUID.randomUUID().toString();
        int ownerUserId = partyRequestDto.getOwnerUserId();
        ChatRoom chatRoom = ChatRoom.builder()
                .roomId(randomId)
                .roomOwnerId(ownerUserId)
                .build();
        chatRooms.put(randomId, chatRoom);

        PartyEntity party =  new PartyEntity();
        party.setOwner_UserId(ownerUserId);
        party.setRegionId(partyRequestDto.getRegionId());
        party.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        party.setPartyStatus('0'); // 0대기 1 달리는 중 2 종료
        PartyEntity savedParty = partyRepository.save(party);

        chatRoom.setPartyId(savedParty.getPartyId());
        chatRoom.setUserName(userName); // 유저 이름
        chatRoom.setUserId(partyRequestDto.getOwnerUserId());
        System.out.println(partyRequestDto.getOwnerUserId());
        return chatRoom;
    }

    @Override
    public String sendMessage() {
        return quotesRepository.findRandomQuote()
                .orElseThrow(() -> new RuntimeException("No quotes available"));
    }

    public void saveUserEntry(int partyId, int userId, Character role) {
        Optional<PartyMemberEntity> existingEntity = partyMemberRepository.findByPartyIdAndUserId(partyId, userId);
        if (existingEntity.isPresent()) {
            // 이미 존재하는 경우 파티 멤버 상태만 업데이트
            PartyMemberEntity entity = existingEntity.get();
            entity.setPartyMemberStatus('0'); // 상태를 업데이트
            entity.setJoinedAt(new Timestamp(System.currentTimeMillis())); // 참여 시간 업데이트 (필요한 경우)
            partyMemberRepository.save(entity);
        } else {
            // 새로운 파티 멤버 엔트리 생성
            PartyMemberEntity entity = new PartyMemberEntity();
            entity.setPartyId(partyId);
            entity.setUserId(userId);
            entity.setRole(role);
            entity.setJoinedAt(new Timestamp(System.currentTimeMillis()));
            entity.setPartyMemberStatus('0');
            partyMemberRepository.save(entity);
        }
    }

    public void exitUserStatus(int partyId, int userId , Character status) {
        PartyMemberEntity member = partyMemberRepository.findByPartyIdAndUserId(partyId, userId)
                .orElseThrow(() -> new RuntimeException("Party member not found"));

        member.setPartyMemberStatus(status);
        partyMemberRepository.save(member);
    }

    public void updatePartyStatus(int partyId, char status) {
        try {
            PartyEntity party = partyRepository.findById(partyId)
                    .orElseThrow(() -> new RuntimeException("Party not found"));

            party.setPartyStatus(status);
            partyRepository.save(party);
        } catch (Exception e) {
            log.error("Error updating party status for partyId: {}", partyId, e);
            throw e; // 예외를 다시 던져서 트랜잭션이 롤백되도록 함
        }

        // 상태가 '종료'로 변경되면 모든 멤버의 데이터를 저장
//        if (status == '3') {
//            saveAllMemberResults(partyId);
//        }
    }

    public void ChangePartyMemberStatus(int partyId, int userId, Character status) {
        PartyMemberEntity member = partyMemberRepository.findByPartyIdAndUserId(partyId, userId)
                .orElseThrow(() -> new RuntimeException("Party member not found for partyId: " + partyId + " and userId: " + userId));

        member.setPartyMemberStatus(status);
        partyMemberRepository.save(member);
    }

    public <T> void sendMessage(WebSocketSession session, T message) {
        try {
            synchronized (session) {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
            }
        } catch (IOException e) {
            log.error("IOException while sending message to session: " + session.getId(), e);
        } catch (IllegalStateException e) {
            log.error("IllegalStateException while sending message to session: " + session.getId(), e);
        }
    }

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 멤버 위치 업데이트 및 이동 거리 계산
    public void updateMemberLocation(int partyId, String memberName, double longitude, double latitude) {
        String geoKey = "team:" + partyId + ":locations";
        String distanceKey = "team:" + partyId + ":distances";

        GeoOperations<String, Object> geoOps = redisTemplate.opsForGeo();

        // 이전 위치 가져오기
        List<Point> positions = geoOps.position(geoKey, memberName);
        Point previousLocation = (positions != null && !positions.isEmpty()) ? positions.get(0) : null;

        // 새로운 위치 추가
        geoOps.add(geoKey, new RedisGeoCommands.GeoLocation<>(memberName, new Point(longitude, latitude)));

        // 이전 위치가 있는 경우 거리 계산
        if (previousLocation != null) {
            double distanceValue = calculateDistance(previousLocation, new Point(longitude, latitude));

            // 누적 거리 업데이트
            updateTotalDistance(distanceKey, memberName, distanceValue);
        }
    }

    // 두 점 간의 거리 계산 (Haversine formula 사용)
    private double calculateDistance(Point oldPoint, Point newPoint) {
        double earthRadius = 6371.0; // 지구 반지름 (킬로미터)

        double latDiff = Math.toRadians(newPoint.getY() - oldPoint.getY());
        double lonDiff = Math.toRadians(newPoint.getX() - oldPoint.getX());

        double a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2)
                + Math.cos(Math.toRadians(oldPoint.getY())) * Math.cos(Math.toRadians(newPoint.getY()))
                * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = earthRadius * c;

        // 소수점 5째 자리까지 포맷팅
        return Math.round(distance * 100000.0) / 100000.0;
    }

    // 누적 거리 업데이트 메서드
    private void updateTotalDistance(String distanceKey, String memberName, double distanceValue) {
        Double currentDistance = (Double) redisTemplate.opsForHash().get(distanceKey, memberName);
        double newTotalDistance = (currentDistance != null ? currentDistance : 0.0) + distanceValue;
        newTotalDistance = Math.round(newTotalDistance * 100000.0) / 100000.0; // 소수점 5째 자리까지 포맷팅
        redisTemplate.opsForHash().put(distanceKey, memberName, newTotalDistance);
    }

    // 한번만 주석해봄

    // 특정 partyId의 모든 멤버의 누적 거리 반환
    public Map<String, Double> getTotalDistances(int partyId) {
        String distanceKey = "team:" + partyId + ":distances";
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(distanceKey);

        Map<String, Double> distances = new HashMap<>();
        for (Map.Entry<Object, Object> entry : entries.entrySet()) {
            double distance = (Double) entry.getValue();
            distances.put((String) entry.getKey(), Math.round(distance * 100000.0) / 100000.0); // 소수점 5째 자리까지 포맷팅
        }
        return distances;
    }

    // 특정 멤버의 누적 거리 반환
    public double getTotalDistanceForMember(int partyId, String memberName) {
        String distanceKey = "team:" + partyId + ":distances";
        Double distance = (Double) redisTemplate.opsForHash().get(distanceKey, memberName);
        return (distance != null) ? Math.round(distance * 100000.0) / 100000.0 : 0.0; // 소수점 5째 자리까지 포맷팅
    }

    public void exitPartyStatus(int partyId, Character status) {
        PartyEntity party = partyRepository.findByPartyId(partyId).orElseThrow(()-> new RuntimeException("Party not found"));
        party.setPartyStatus(status);
        partyRepository.save(party);
    }


}
