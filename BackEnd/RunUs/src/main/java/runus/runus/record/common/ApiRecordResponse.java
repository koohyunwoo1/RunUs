package runus.runus.record.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.record.dto.RecordDTO;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ApiRecordResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private int totalPages;
    private long totalElements;
    private int pageNumber;
    private int pageSize;

    public void setSuccess(T data, Page<RecordDTO> pageData, String message) {
        this.success = true;
        this.data = data;
        this.message = message;
        this.totalPages = pageData.getTotalPages();
        this.totalElements = pageData.getTotalElements();
        this.pageNumber = pageData.getNumber();
        this.pageSize = pageData.getSize();
    }
}
