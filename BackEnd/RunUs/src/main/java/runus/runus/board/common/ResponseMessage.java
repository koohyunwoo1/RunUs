package runus.runus.board.common;

import java.util.List;

public class ResponseMessage {

    private String message;
    private Object data;

    public ResponseMessage(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
