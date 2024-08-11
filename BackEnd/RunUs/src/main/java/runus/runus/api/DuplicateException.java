package runus.runus.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)  // 409 Conflict 상태 코드를 반환
public class DuplicateException extends RuntimeException {
    public DuplicateException(String message) {
        super(message);
    }
}
