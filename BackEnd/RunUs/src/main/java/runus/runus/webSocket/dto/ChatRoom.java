package runus.runus.webSocket.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;
import runus.runus.fcm.dto.NotificationDTO;
import runus.runus.fcm.service.FCMService;
import runus.runus.fcm.service.FCMServiceImpl;
import runus.runus.record.service.RecordService;
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

    private RecordService recordService;

    // FCM 사용
    private FCMService fcmService;

    // 방장과 멀어지는 거리 100 M
    private static final double  MAX_DISTANCE = 0.1; // 최대허용 거리 (km)


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

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구의 반지름, km로 계산

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = R * c;

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
            sendMessage(chatMessage, chatServiceImpl);

            chatServiceImpl.exitUserStatus(partyId, userId, '3');
            log.info(userId + " status 3으로 변경 끝");
            chatServiceImpl.exitPartyStatus(partyId, '3');
            log.info(partyId + " party status 3으로 변경 끝");

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.START)) {
            if (userId == roomOwnerId) {
                chatServiceImpl.updatePartyStatus(partyId, '1'); // Update status to 'running'
                chatMessage.setMessage("시작 버튼을 눌렀습니다.");

                // 모든 사용자에게 START 메시지 브로드캐스트
                ChatMessage startBroadcastMessage = new ChatMessage();
                startBroadcastMessage.setType(ChatMessage.MessageType.START);
                startBroadcastMessage.setRoomId(chatMessage.getRoomId());
                startBroadcastMessage.setSender("SYSTEM");
                startBroadcastMessage.setMessage("세션이 시작되었습니다.");

                sendMessage(startBroadcastMessage, chatServiceImpl);
            }

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.TALK)) {
            chatMessage.setMessage(userName + ": " + chatMessage.getMessage());

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.LOCATION)) {
            double ownerDistance = 0;
            if (userId == roomOwnerId) {
                // 방장 위치 업데이트
                double previousOwnerLatitude = this.ownerLatitude;
                double previousOwnerLongitude = this.ownerLongitude;
                this.ownerLatitude = latitude;
                this.ownerLongitude = longitude;

                // 위치가 변경되지 않았다면 거리 증가하지 않도록 처리
                if (previousOwnerLatitude != latitude && previousOwnerLongitude != longitude) {
                    double distanceTraveled = calculateDistance(previousOwnerLatitude, previousOwnerLongitude, latitude, longitude);
                    log.info("방장 위치 업데이트: 위도=" + ownerLatitude + ", 경도=" + ownerLongitude);
                    log.info("방장 이동 거리: " + String.format("%.5f", distanceTraveled) + " km");

                    // 방장 이동 거리 저장
                    chatServiceImpl.updateMemberLocation(partyId, userName, longitude, latitude);
                    double totalDistance = chatServiceImpl.getTotalDistanceForMember(partyId, userName);
                    log.info(userName + "의 총 이동 거리: " + String.format("%.5f", totalDistance) + " km");
                    chatMessage.setMessage(userName + "의 총 이동 거리: " + String.format("%.5f", totalDistance) + " km");

                } else {
                    log.info("위치가 변경되지 않았으므로 이동 거리를 증가시키지 않습니다.");
                }

                sendMessage(chatMessage, chatServiceImpl);

            } else {
                // 방장이 아닌 경우
                double distance = calculateDistance(ownerLatitude, ownerLongitude, latitude, longitude);
                log.info(userName + " 위치 업데이트: 위도=" + latitude + ", 경도=" + longitude);
                log.info(userName + "님과 방장의 거리: " + String.format("%.5f", distance) + " km");
                chatMessage.setMessage(userName + "의 위치가 업데이트되었습니다. 방장과의 거리: " + String.format("%.5f", distance) + " km");

                // 사용자 이동 거리 계산
                chatServiceImpl.updateMemberLocation(partyId, userName, longitude, latitude);
                double totalDistance = chatServiceImpl.getTotalDistanceForMember(partyId, userName);
                log.info(userName + "의 총 이동 거리: " + String.format("%.5f", totalDistance) + " km");
                chatMessage.setMessage(userName + "의 총 이동 거리: " + String.format("%.5f", totalDistance) + " km");
                sendMessage(chatMessage, chatServiceImpl);

                
                // 멀어진 팀원 및 팀장에게 알림 24.08.05 이형준
                if (distance > MAX_DISTANCE) {
                    sendDistanceAlert(userId, userName, distance, false);
                    sendDistanceAlert(roomOwnerId, userName, distance, true);
                    System.out.println("call distance with leader and member");
                }
            }

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.WAIT_EXIT)) { //대기방에서 나가는 경우
            chatServiceImpl.ChangePartyMemberStatus(partyId, userId, '1');
            users.remove(userName);
            chatMessage.setMessage(userName + "님이 퇴장했습니다.(대기방)");

            // 사용자 퇴장 로그 메시지 추가
            log.info(userName + "님이 대기방에서 퇴장했습니다. (유저 ID: " + userId + ")");

        } else if (chatMessage.getType().equals(ChatMessage.MessageType.RUN_EXIT)) { //달리는 중에 나가는 경우
            chatServiceImpl.ChangePartyMemberStatus(partyId, userId, '2');
            users.remove(userName);
            chatMessage.setMessage(userName + "님이 퇴장했습니다.");
            // 사용자 퇴장 로그 메시지 추가
            log.info(userName + "님이 러닝 중에 퇴장했습니다. (유저 ID: " + userId + ")");
        }

        // Send message to all users
        sendMessage(chatMessage, chatServiceImpl);

        // Send updated user list to all clients
        if (chatMessage.getType().equals(ChatMessage.MessageType.ENTER) || chatMessage.getType().equals(ChatMessage.MessageType.QUIT) ||
                chatMessage.getType().equals(ChatMessage.MessageType.RUN_EXIT) || chatMessage.getType().equals(ChatMessage.MessageType.WAIT_EXIT)) {
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
                    log.info("Message sent to session " + session.getId() + ": " + message);
                }
            } catch (IllegalStateException e) {
                log.error("Failed to send message to session: " + session.getId(), e);
            }
        });
    }


    private void sendDistanceAlert(int userId, String userName, double distance, boolean isOwner) {
        try {
            String title = isOwner ? "팀원 거리 경고" : "거리 경고";
            String body = isOwner
                    ? userName + "님이 " + String.format("%.2f", distance) + "km 떨어졌습니다."
                    : "방장과의 거리가 " + String.format("%.2f", distance) + "km로 멀어졌습니다.";

            NotificationDTO notification = new NotificationDTO(title, body);
            fcmService.sendNotification(String.valueOf(userId), notification);
            System.out.println("call sendDistanceAlert (ChatRoom)");
        } catch (Exception e) {
            log.error("Failed to send distance alert to user: " + userId, e);
            System.out.println("call sendDistanceAlert (ChatRoom)");
        }
    }
}
