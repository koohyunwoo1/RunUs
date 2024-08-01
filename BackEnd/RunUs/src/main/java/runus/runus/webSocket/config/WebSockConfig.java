package runus.runus.webSocket.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import runus.runus.webSocket.handler.WebSockChatHandler;

@RequiredArgsConstructor
@Configuration
@EnableWebSocket
public class WebSockConfig implements WebSocketConfigurer {
//    private final WebSocketHandler webSocketHandler;
    private final WebSockChatHandler webSockChatHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSockChatHandler, "/ws/chat").setAllowedOrigins("*");
//        registry.addHandler(webSocketHandler, "ws/chat").setAllowedOrigins("*").withSockJS();
    }
}
