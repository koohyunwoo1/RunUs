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
    private int partyId;
    private int userId;
    private String userName;
    private Set<WebSocketSession> sessions = new HashSet<>();
    private Set<String> users = new HashSet<>();

    private int roomOwnerId = -1; //방 생성자의 ID

    @Builder
    public ChatRoom(String roomId, String userName, int roomOwnerId) {
        this.roomId = roomId;
        this.userName = userName;
        this.roomOwnerId = roomOwnerId;
    }

    public void setPartyId(int partyId) {this.partyId = partyId;}
    public void setUserName(String userName) {this.userName = userName;}
    public void setuserId(int userId) {this.userId = userId;}


    private Character determinRole(int userId, int partyId){

        System.out.println("비교" + roomOwnerId +" : " +userId);

        if(roomOwnerId == userId){
            return '1';
        }else{
            return '0';
        }
    }

    public void handleActions(WebSocketSession session, ChatMessage chatMessage, ChatServiceImpl chatServiceImpl) {
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER)) {
            sessions.add(session);
            users.add(chatMessage.getSender());
            chatMessage.setMessage(chatMessage.getSender() + "님이 입장했습니다.");

            System.out.println(partyId);
            int userId = chatMessage.getUserId();
            Character role = determinRole(userId, partyId);
            chatServiceImpl.saveUserEntry(partyId, userId,role);

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.QUIT)) {
            sessions.remove(session);
            users.remove(chatMessage.getSender());
            chatMessage.setMessage(chatMessage.getSender() + "님이 퇴장했습니다.");

            int userId = chatMessage.getUserId();
            chatServiceImpl.exitUserStatus(partyId, userId, '1');
        } else if (chatMessage.getType().equals(ChatMessage.MessageType.START)) {
            int userId = chatMessage.getUserId();
            if (userId == roomOwnerId) {
                chatServiceImpl.updatePartyStatus(partyId, '1'); // Update status to 'running'
                chatMessage.setMessage("시작 버튼을 눌렀습니다."); //나중에 WEBRTC로 넘어가는 로직 추가 필요
            }
        }else if (chatMessage.getType().equals(ChatMessage.MessageType.TALK)) {
            chatMessage.setMessage(chatMessage.getSender() + ": " + chatMessage.getMessage());
        }

        // Send message to all users
        sendMessage(chatMessage, chatServiceImpl);

        // Send updated user list to all clients
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER) || chatMessage.getType().equals(ChatMessage.MessageType.QUIT)) {
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
