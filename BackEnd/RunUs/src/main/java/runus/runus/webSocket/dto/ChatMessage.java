package runus.runus.webSocket.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    //메시지 타입 : 입장, 채팅
    public enum MessageType{
        ENTER, TALK, QUIT, USERLIST_UPDATE, START, LOCATION

    }

    private MessageType type; // 메시지 타입
    private String roomId; //방 번호
    private String sender; //메세지 보낸 사람
    private String message; //메시지
    private int userId; // 사용자 ID 필드 추가

    private double longitude;
    private double latitude;
}
