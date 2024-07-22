package runus.runus.board.common;

import lombok.Data;

/**
 * API 응답 메시지를 정의하는 클래스입니다.
 */
@Data
public class ResponseMessage {
    private String message;  // 응답 메시지
    private Object data;     // 응답 데이터

    /**
     * 생성자
     *
     * @param message 응답 메시지
     * @param data    응답 데이터
     */
    public ResponseMessage(String message, Object data) {
        this.message = message;
        this.data = data;
    }
}
