package runus.runus.webSocket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.webSocket.Entity.PartyEntity;
import runus.runus.webSocket.Entity.PartyMemberEntity;
import runus.runus.webSocket.dto.PartyDto;
import runus.runus.webSocket.dto.PartyMemberDto;
import runus.runus.webSocket.repository.PartyMemberRepository;
import runus.runus.webSocket.repository.PartyRepository;
import runus.runus.webSocket.repository.QuotesRepository;
import runus.runus.webSocket.dto.ChatRoom;
import runus.runus.webSocket.dto.PartyRequestDto;

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
        chatRoom.setUserName(userName); //유저 이름
        chatRoom.setuserId(partyRequestDto.getOwnerUserId());
        System.out.println(partyRequestDto.getOwnerUserId());
        return chatRoom;
    }

    @Override
    public String sendMessage() {
        return quotesRepository.findRandomQuote()
                .orElseThrow(() -> new RuntimeException("No quotes available"));
    }

    public void saveUserEntry(int partyId, int userId, Character role) {
        PartyMemberEntity entity = new PartyMemberEntity();
        entity.setPartyId(partyId);
        entity.setUserId(userId);
        entity.setRole(role);
        entity.setJoinedAt(new Timestamp(System.currentTimeMillis()));
        entity.setPartyMemberStatus('0');
        partyMemberRepository.save(entity);
    }

    public void exitUserStatus(int partyId, int userId , Character status) {
        PartyMemberEntity member = partyMemberRepository.findByPartyIdAndUserId(partyId, userId)
                .orElseThrow(() -> new RuntimeException("Party member not found"));

        member.setPartyMemberStatus(status);
        partyMemberRepository.save(member);
    }

    public void updatePartyStatus(int partyId, char status) {
        PartyEntity party = partyRepository.findById(partyId)
                .orElseThrow(() -> new RuntimeException("Party not found"));

        party.setPartyStatus(status);
        partyRepository.save(party);
    }

    public <T> void sendMessage(WebSocketSession session, T message){
        try{
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        }catch(IOException e){
            log.error(e.getMessage(),e);
        }
    }


}
