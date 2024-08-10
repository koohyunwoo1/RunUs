package runus.runus.record.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.api.NotFoundElementException;
import runus.runus.record.dto.RecordDTO;
import runus.runus.record.dto.RecordSaveRequestDTO;
import runus.runus.record.entity.RecordEntity;
import runus.runus.record.repository.RecordRepository;
import runus.runus.user.entity.User;
import runus.runus.user.repository.UserRepository;
import runus.runus.user.service.UserService;
import runus.runus.webSocket.service.ChatService;
import runus.runus.webSocket.service.ChatServiceImpl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private UserRepository userRepository;

    // 최근 기록 가져오기
    public List<RecordEntity> getRecentRecords(Integer userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return recordRepository.findTopByUser_idOrderByRecordDateDesc(userId, pageable);
    }

    // 전체 기록 가져오기 - refactor
    public Page<RecordDTO> getRecords(Integer userId, int size, int page) {
        Pageable pageable1 = PageRequest.of(page, size);
        Page<RecordDTO> records = recordRepository.findRecord(userId, pageable1);
        return records;
    }

    // 지금까지 달린 총 거리 계산
    public Integer getTotalDistance(Integer userId) {
        Integer totalDistance = recordRepository.sumDistanceByUserId(userId);
        return totalDistance;
    }

    public List<Map<String, Object>> getMonthlyStatistics(Integer userId, Integer year) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        List<RecordEntity> records = recordRepository.findByUserIdAndDateRange(userId, startOfYear, endOfYear);

        if (records == null || records.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Integer, Map<String, Object>> monthlyStats = records.stream()
                .collect(Collectors.groupingBy(
                        record -> record.getRecordDate().getMonthValue(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                monthRecords -> {
                                    int totalDistance = monthRecords.stream().mapToInt(RecordEntity::getDistance).sum();
                                    int totalTime = monthRecords.stream().mapToInt(RecordEntity::getTime).sum();
                                    int recordCount = monthRecords.size();
                                    return Map.of("month", monthRecords.get(0).getRecordDate().getMonthValue(),
                                            "totalDistance", totalDistance,
                                            "totalTime", totalTime,
                                            "recordCount", recordCount);
                                }
                        )
                ));

        return monthlyStats.values().stream().collect(Collectors.toList());
    }

    public RecordEntity saveRecord(RecordSaveRequestDTO requestDTO) {
        RecordEntity record = new RecordEntity();
        record.setUserId(requestDTO.getUserId());

        if(requestDTO.getPartyId() != null ) {
            record.setPartyId(requestDTO.getPartyId());
            chatService.updatePartyStatus(requestDTO.getPartyId(), '3'); //파티 완주 완료
            chatService.exitUserStatus(requestDTO.getPartyId(), requestDTO.getUserId(), '3'); //유저 완주 완료
        }
        record.setDistance(requestDTO.getDistance() != null ? requestDTO.getDistance() : 0);
        record.setTime(requestDTO.getTime() != null ? requestDTO.getTime() : 0);
        record.setKcal(requestDTO.getKcal() != null ? requestDTO.getKcal() : 0);
        record.setRecordDate(LocalDateTime.now());

        RecordEntity savedRecord = recordRepository.save(record);

        updateUserExperience(requestDTO);

        return savedRecord;
    }

    private void updateUserExperience(RecordSaveRequestDTO requestDTO) {
        Optional<User> optionalUser = userRepository.findById(requestDTO.getUserId());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getExp() == null) {
                user.setExp(0); // 기본값 설정
            }

            if (requestDTO.getPartyId() == null) {
                user.setExp(user.getExp() + requestDTO.getDistance() * 10 / 1000);
            } else {
                user.setExp(user.getExp() + (int) (requestDTO.getDistance() * 13 / 1000));
            }

            userRepository.save(user);
        }
    }
}
