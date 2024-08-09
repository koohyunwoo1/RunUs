package runus.runus.board.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ApiBoardResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private int totalPages;
    private long totalElements;
    private int pageNumber;
    private int pageSize;
}
