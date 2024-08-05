package runus.runus.webSocket.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.webSocket.dto.ApiResponse;
import runus.runus.webSocket.dto.ChatRoom;
import runus.runus.webSocket.dto.PartyRequestDto;
import runus.runus.webSocket.service.ChatServiceImpl;


@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/team")
public class RoomController {
    private final ChatServiceImpl chatService;

    @PostMapping("/create_room")
    public ResponseEntity<ApiResponse<ChatRoom>> createRoom(@RequestBody PartyRequestDto partyRequestDto, String userName){
        try {
            ChatRoom chatRoom = chatService.createRoom(partyRequestDto, userName);
            ApiResponse<ChatRoom> response = new ApiResponse<>(true, chatRoom, "방 생성 성공");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<ChatRoom> response = new ApiResponse<>(false, null, "방 생성 실패" + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/message")
    public ResponseEntity<?> sendMessage(){
        String message =  chatService.sendMessage();
        return ResponseEntity.ok(new ApiResponse<>(true, message, "동기부여 글 조회 성공"));
    }

}
