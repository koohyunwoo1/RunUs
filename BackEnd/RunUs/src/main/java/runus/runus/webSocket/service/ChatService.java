package runus.runus.webSocket.service;

import runus.runus.webSocket.dto.ChatRoom;
import runus.runus.webSocket.dto.PartyRequestDto;

public interface ChatService {
    ChatRoom createRoom(PartyRequestDto partyRequestDto);
    String sendMessage();
}
