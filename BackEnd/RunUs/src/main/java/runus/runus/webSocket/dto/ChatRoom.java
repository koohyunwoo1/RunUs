package runus.runus.webSocket.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.webSocket.service.ChatServiceImpl;

import java.util.HashSet;
import java.util.Set;

@Getter
public class ChatRoom {
    private String roomId;

    private Set<WebSocketSession> sessions = new HashSet<>();
    private Set<String> users = new HashSet<>();

    @Builder
    public ChatRoom(String roomId, String name) {
        this.roomId = roomId;
    }

    public void handleActions(WebSocketSession session, ChatMessage chatMessage, ChatServiceImpl chatServiceImpl) {
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER)) {
            sessions.add(session);
            users.add(chatMessage.getSender());
            chatMessage.setMessage(chatMessage.getSender() + "님이 입장했습니다.");
        } else if (chatMessage.getType().equals(ChatMessage.MessageType.QUIT)) {
            sessions.remove(session);
            users.remove(chatMessage.getSender());
            chatMessage.setMessage(chatMessage.getSender() + "님이 퇴장했습니다.");
        } else if (chatMessage.getType().equals(ChatMessage.MessageType.TALK)) {
            chatMessage.setMessage(chatMessage.getSender() + ": " + chatMessage.getMessage());
        }

        // Send message to all users
        sendMessage(chatMessage, chatServiceImpl);

        // Send updated user list to all clients
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER) || chatMessage.getType().equals(ChatMessage.MessageType.QUIT)) {
            System.out.println("Check");
            ChatMessage userListUpdate = new ChatMessage();
            userListUpdate.setType(ChatMessage.MessageType.USERLIST_UPDATE);
            userListUpdate.setRoomId(chatMessage.getRoomId());
            userListUpdate.setSender("SYSTEM");
            userListUpdate.setMessage("현재 방에 있는 사용자: " + String.join(", ", users));
            sendMessage(userListUpdate, chatServiceImpl);
        }
    }

    public <T> void sendMessage(T message, ChatServiceImpl chatServiceImpl) {
        sessions.parallelStream().forEach(session -> chatServiceImpl.sendMessage(session, message));
    }
}
