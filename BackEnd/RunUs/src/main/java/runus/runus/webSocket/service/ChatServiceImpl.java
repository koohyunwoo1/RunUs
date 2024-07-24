package runus.runus.webSocket.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.Entity.PartyEntity;
import runus.runus.repository.PartyRepository;
import runus.runus.repository.QuotesRepository;
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

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
    }


    public ChatRoom findRoomById(String roomId){
        return chatRooms.get(roomId);
    }

    @Override
    public ChatRoom createRoom(PartyRequestDto partyRequestDto){
        String randomId = UUID.randomUUID().toString();
        ChatRoom chatRoom = ChatRoom.builder()
                .roomId(randomId)
                .build();
        chatRooms.put(randomId, chatRoom);

        PartyEntity party =  new PartyEntity();
        party.setOwner_UserId(partyRequestDto.getOwnerUserId());
        party.setRegionId(partyRequestDto.getRegionId());
        party.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        party.setPartyStatus('0'); // 0대기 1 달리는 중 2 종료
        partyRepository.save(party);

        return chatRoom;
    }

    @Override
    public String sendMessage() {
        return quotesRepository.findRandomQuote()
                .orElseThrow(() -> new RuntimeException("No quotes available"));
    }

    public <T> void sendMessage(WebSocketSession session, T message){
        try{
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        }catch(IOException e){
            log.error(e.getMessage(),e);
        }
    }


}
