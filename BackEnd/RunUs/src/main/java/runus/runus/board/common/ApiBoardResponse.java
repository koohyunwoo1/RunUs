package runus.runus.board.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import runus.runus.board.dto.BoardResponseDTO;

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

    public void setResponseTrue(T data, Page<BoardResponseDTO> pageData, String message) {
        this.success = true;
        this.data = data;
        this.message = message;
        this.totalPages = pageData.getTotalPages();
        this.totalElements = pageData.getTotalElements();
        this.pageNumber = pageData.getNumber();
        this.pageSize = pageData.getSize();
    }

    public void setResponseFalse(T data, Page<BoardResponseDTO> pageData, String message) {
        this.success = false;
        this.data = data;
        this.message = message;
    }
}
