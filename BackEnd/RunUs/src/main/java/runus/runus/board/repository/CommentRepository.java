package runus.runus.board.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.board.entity.CommentEntity;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    List<CommentEntity> findByBoardIdAndIsDeleted(int boardId, char isDeleted, Pageable pageable);

    // 댓글 목록 + 닉네임
    @Query("SELECT new runus.runus.board.dto.CommentResponseDTO(c.commentId, c.boardId, c.parentId, c.userId, c.content, c.createdAt, c.updatedAt, COALESCE(u.nickname, 'undefined')) " +
            "FROM CommentEntity c LEFT JOIN runus.runus.user.entity.User u ON c.userId = u.userId " +
            "WHERE c.boardId = :boardId AND c.isDeleted = :isDeleted " +
            "ORDER BY c.boardId ASC ")
    Page<CommentResponseDTO> findBoardComents(@Param("boardId") int boardId, char isDeleted, Pageable pageable);
}
