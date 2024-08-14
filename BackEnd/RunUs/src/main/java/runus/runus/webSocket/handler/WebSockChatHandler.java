package runus.runus.webSocket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.common.lang.NonNullApi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import runus.runus.webSocket.dto.ChatMessage;
import runus.runus.webSocket.dto.ChatRoom;
import runus.runus.webSocket.service.ChatServiceImpl;

//@Slf4j
//@RequiredArgsConstructor
//@Component
//public class WebSockChatHandler extends TextWebSocketHandler {
//    private final ObjectMapper objectMapper;
//    private final ChatServiceImpl chatServiceImpl;
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        log.info("payload: {}", payload);
//
//        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
//
//        try {
//            ChatRoom room = chatServiceImpl.findRoomById(chatMessage.getRoomId());
//            room.handleActions(session, chatMessage, chatServiceImpl);
//        }
//        catch (NullPointerException e){
//            log.error("Room ID {}에 대한 ChatRoom을 찾을 수 없습니다.", chatMessage.getRoomId(), e);
//            session.sendMessage(new TextMessage("채팅방을 찾을 수 없습니다. 방 ID: " + chatMessage.getRoomId()));
//        }catch (Exception e) {
//            log.error("메시지를 처리하는 중 오류가 발생했습니다.", e);
//            session.sendMessage(new TextMessage("메시지를 처리하는 중 오류가 발생했습니다."));
//        }
//    }
//
//
//}

@Slf4j
@RequiredArgsConstructor
@Component
// 밑에껀 없어도 되는거 같음
@NonNullApi
public class WebSockChatHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final ChatServiceImpl chatServiceImpl;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Connection established with session: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
                String payload = message.getPayload();
        log.info("Received payload: {}", payload);

        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);

        try {
            ChatRoom room = chatServiceImpl.findRoomById(chatMessage.getRoomId());
            room.handleActions(session, chatMessage, chatServiceImpl);
        }
        catch (NullPointerException e){
            log.error("Room ID {}에 대한 ChatRoom을 찾을 수 없습니다.", chatMessage.getRoomId(), e);
            session.sendMessage(new TextMessage("채팅방을 찾을 수 없습니다. 방 ID: " + chatMessage.getRoomId()));
        }catch (Exception e) {
            log.error("메시지를 처리하는 중 오류가 발생했습니다.", e);
            session.sendMessage(new TextMessage("메시지를 처리하는 중 오류가 발생했습니다."));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Connection closed with session: {}", session.getId());
    }
}
