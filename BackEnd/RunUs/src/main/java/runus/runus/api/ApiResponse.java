package runus.runus.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;

    public void setSuccess(T data, String message) {
        this.success = true;
        this.data = data;
        this.message = message;
    }

    public void setFail(T data, String message) {
        this.success = false;
        this.data = data;
        this.message = message;
    }
}