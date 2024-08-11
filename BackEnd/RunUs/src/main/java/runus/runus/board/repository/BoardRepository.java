package runus.runus.board.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.entity.BoardEntity;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    // 게시글 상세보기
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.boardId = :boardId")
    BoardResponseDTO findByIdDetail(@Param("boardId") int boardId);


    // 게시글 목록
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted " +
            "ORDER BY b.boardId DESC ")
    Page<BoardResponseDTO> findByRegionId(@Param("regionId") int regionId, @Param("isDeleted") char isDeleted, Pageable pageable);

    // 게시글 목록 - 검색
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.title LIKE %:title% " +
            "ORDER BY b.boardId DESC ")
    Page<BoardResponseDTO> findByRegionIdByKeyword(@Param("regionId") int regionId, @Param("title") String title, @Param("isDeleted") char isDeleted, Pageable pageable);

    
    // 달리기 기한 가까운 목록
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.meetingTime >= CURRENT_TIMESTAMP " +
            "ORDER BY b.meetingTime ASC")
    Page<BoardResponseDTO> findUpcomingMeetings(@Param("regionId") int regionId, @Param("isDeleted") char isDeleted, Pageable pageable);

    // 달리기 기한 가까운 목록 - 검색
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.meetingTime >= CURRENT_TIMESTAMP AND b.title LIKE %:title% " +
            "ORDER BY b.meetingTime ASC")
    Page<BoardResponseDTO> findUpcomingMeetingsByKeyword(@Param("regionId") int regionId, @Param("title") String title, @Param("isDeleted") char isDeleted, Pageable pageable);


    // 달리기 안 끝난 목록
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.meetingTime >= CURRENT_TIMESTAMP " +
            "ORDER BY b.boardId desc ")
    Page<BoardResponseDTO> findIncompleteMeetings(@Param("regionId") int regionId, @Param("isDeleted") char isDeleted, Pageable pageable);

    // 달리기 안 끝난 목록 - 검색
    @Query("SELECT new runus.runus.board.dto.BoardResponseDTO(b.boardId, b.title, b.content, b.createdAt, b.updatedAt, b.regionId, b.meetingTime, b.meetingDay, COALESCE(u.nickname, 'undefined'), b.isDeleted) " +
            "FROM BoardEntity b LEFT JOIN runus.runus.user.entity.User u ON b.userId = u.userId " +
            "WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.meetingTime >= CURRENT_TIMESTAMP AND b.title LIKE %:title% " +
            "ORDER BY b.boardId DESC ")
    Page<BoardResponseDTO> findIncompleteMeetingsByKeyword(@Param("regionId") int regionId, @Param("title") String title, @Param("isDeleted") char isDeleted, Pageable pageable);
}
