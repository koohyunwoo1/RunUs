package runus.runus.webSocket.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.webSocket.service.ChatServiceImpl;

import java.util.HashSet;
import java.util.Set;

@Getter
@Slf4j
public class ChatRoom {
    private String roomId;
    private int partyId;
    private int userId;
    private String userName;
    private Set<WebSocketSession> sessions = new HashSet<>();
    private Set<String> users = new HashSet<>();

    private int roomOwnerId = -1; // 방 생성자의 ID
    private double ownerLatitude; // 방 생성자의 위도
    private double ownerLongitude; // 방 생성자의 경도

    @Builder
    public ChatRoom(String roomId, String userName, int roomOwnerId) {
        this.roomId = roomId;
        this.userName = userName;
        this.roomOwnerId = roomOwnerId;
    }

    // Setter methods for partyId, userName, userId
    public void setPartyId(int partyId) { this.partyId = partyId; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setUserId(int userId) { this.userId = userId; }

    private Character determineRole(int userId) {
        return (roomOwnerId == userId) ? '1' : '0';
    }

    // ChatRoom 클래스의 calculateDistance 메서드 수정
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구의 반지름, km로 계산

        // 위도와 경도를 라디안 단위로 변환
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        // 거리 계산을 위한 하버사인 공식
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = R * c;

        // 디버깅을 위한 로그
        log.debug("lat1: " + lat1 + ", lon1: " + lon1 + ", lat2: " + lat2 + ", lon2: " + lon2);
        log.debug("latDistance: " + latDistance + ", lonDistance: " + lonDistance);
        log.debug("a: " + a + ", c: " + c);
        log.debug("Calculated distance: " + distance);

        return distance;
    }

    public void handleActions(WebSocketSession session, ChatMessage chatMessage, ChatServiceImpl chatServiceImpl) {
        String userName = chatMessage.getSender(); // 사용자 이름
        double longitude = chatMessage.getLongitude();
        double latitude = chatMessage.getLatitude();
        int userId = chatMessage.getUserId(); // 사용자 ID

        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER)) {
            sessions.add(session);
            users.add(userName);
            chatMessage.setMessage(userName + "님이 입장했습니다.");

            Character role = determineRole(userId);
            chatServiceImpl.saveUserEntry(partyId, userId, role);

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.QUIT)) {
            sessions.remove(session);
            users.remove(userName);
            chatMessage.setMessage(userName + "님이 퇴장했습니다.");

            chatServiceImpl.exitUserStatus(partyId, userId, '1');

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.START)) {
            if (userId == roomOwnerId) {
                chatServiceImpl.updatePartyStatus(partyId, '1'); // Update status to 'running'
                chatMessage.setMessage("시작 버튼을 눌렀습니다."); // 나중에 WEBRTC로 넘어가는 로직 추가 필요
            }

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.TALK)) {
            chatMessage.setMessage(userName + ": " + chatMessage.getMessage());

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.LOCATION)) {
            if (userId == roomOwnerId) {
                // 방장일 경우 위치 업데이트
                this.ownerLatitude = latitude;
                this.ownerLongitude = longitude;
                log.info("방장 위치 업데이트: 위도=" + ownerLatitude + ", 경도=" + ownerLongitude);
                chatMessage.setMessage(userName + "의 위치가 업데이트되었습니다. 방장으로서의 위치: 위도=" + latitude + ", 경도=" + longitude);

            } else {
                // 방장과 팀원 간 거리 계산
                double distance = calculateDistance(ownerLatitude, ownerLongitude, latitude, longitude);
                log.info(userName + " 위치 업데이트: 위도=" + latitude + ", 경도=" + longitude);
                log.info(userName + "님과 방장의 거리: " + distance + " km");
                chatMessage.setMessage(userName + "의 위치가 업데이트되었습니다. 방장과의 거리: " + distance + " km");
            }

            // Redis에 위치 정보를 저장합니다.
            chatServiceImpl.updateMemberLocation(partyId, userName, longitude, latitude);
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
        sessions.forEach(session -> {
            try {
                if (session.isOpen()) {
                    chatServiceImpl.sendMessage(session, message);
                }
            } catch (IllegalStateException e) {
                // 세션이 잘못된 상태일 때 처리 로직
                log.error("Failed to send message to session: " + session.getId(), e);
            }
        });
    }
}
