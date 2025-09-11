package org.example.backend.global.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompChannelInterceptor stompChannelInterceptor;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // 인터셉터 등록
        registration.interceptors(stompChannelInterceptor);
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 핸드쉐이크
        registry.addEndpoint("/ws-connect").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub"); // 메시지 받을 경로
        registry.setApplicationDestinationPrefixes("/pub"); // 메시지 보낼 경로
    }
}
