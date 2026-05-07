// package com.example.jumbowatch.soket;

// import java.util.HashMap;
// import java.util.Map;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.event.EventListener;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Component;
// import org.springframework.web.socket.messaging.SessionConnectEvent;
// import org.springframework.web.socket.messaging.SessionDisconnectEvent;

// @Component
// public class WebSocketEventListener {

//     @Autowired
//     private SimpMessagingTemplate messagingTemplate;

//     @EventListener
//     public void handleWebSocketConnectListener(SessionConnectEvent event) {
//         System.out.println("Admin has connected!");
        
//         Map<String, String> msg = new HashMap<>();
//         msg.put("status", "ONLINE");
//         // '/topic/admin-status' අහගෙන ඉන්න අයට මේ පණිවිඩය යනවා
//         messagingTemplate.convertAndSend("/topic/admin-status", msg);
//     }

//     @EventListener
//     public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//         System.out.println("Admin has disconnected!");
        
//         Map<String, String> msg = new HashMap<>();
//         msg.put("status", "OFFLINE");
//         messagingTemplate.convertAndSend("/topic/admin-status", msg);
//     }
// }


package com.example.jumbowatch.soket;

import java.util.HashMap;
import java.util.Map; // ඔයාගේ repository එක

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.example.jumbowatch.repository.AdminRepository;

// @Component
// public class WebSocketEventListener {

//     @Autowired
//     private SimpMessagingTemplate messagingTemplate;

//     @Autowired
//     private AdminRepository adminRepository;

//     @EventListener
//     public void handleWebSocketConnectListener(SessionConnectEvent event) {
//         StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
//         // Principal එකෙන් Log වුණු user ගේ නම ගන්නවා
//         String username = headerAccessor.getFirstNativeHeader("username");
//         System.out.println("Admin connected via WebSocket: " + username);
//         if (username == null) {
//             System.err.println("Username is NULL - Authentication missing!");
//             return;
//         }
        
//         if (username != null) {
//             // Database එකේ status එක true කරනවා
//             updateAdminStatus(username, true);
            
//             System.out.println("✅ Admin logged in via WebSocket: " + username);

//             // අනිත් අයට දැනුම් දෙනවා මේ Admin Online කියලා
//             Map<String, String> msg = new HashMap<>();
//             msg.put("username", username);
//             msg.put("status", "ONLINE");
//             messagingTemplate.convertAndSend("/topic/admin-status", msg);
//         }
//     }

//     @EventListener
//     public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
//         StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//         String username = headerAccessor.getFirstNativeHeader("username");
        
//          if (username == null) {
//             System.err.println("Username is NULL on disconnect - Authentication missing!");
//             return;
//         }

//         if (username != null) {
//             // Database එකේ status එක false කරනවා
//             updateAdminStatus(username, false);
            
//             System.out.println("🛑 Admin logged out via WebSocket: " + username);

//             Map<String, String> msg = new HashMap<>();
//             msg.put("username", username);
//             msg.put("status", "OFFLINE");
//             messagingTemplate.convertAndSend("/topic/admin-status", msg);
//         }
//     }

//     private void updateAdminStatus(String username, boolean status) {

//         System.out.println("Updating admin status in DB for: " + username + " to " + (status ? "ONLINE" : "OFFLINE"));
//         adminRepository.findById(username).ifPresent(admin -> {
//             admin.setIs_logged(status); // මෙතන ඔයාගේ column එකට අදාළ setter එක පාවිච්චි කරන්න
//             adminRepository.save(admin);
//         });
//     }
// }


@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AdminRepository adminRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = headerAccessor.getFirstNativeHeader("username");

        if (username != null) {
            // Importatn: Store the username in session attributes for later retrieval on disconnect
            headerAccessor.getSessionAttributes().put("username", username);

            updateAdminStatus(username, true);
            
            System.out.println("Admin connected: " + username);

            Map<String, String> msg = new HashMap<>();
            msg.put("username", username);
            msg.put("status", "ONLINE");
            messagingTemplate.convertAndSend("/topic/admin-status", msg);
        } else {
            System.err.println("Connect Error: Username header is missing!");
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        
        // get the username from session attributes instead of headers, because on disconnect headers might not be available
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            updateAdminStatus(username, false);
            
            System.out.println("Admin disconnected: " + username);

            Map<String, String> msg = new HashMap<>();
            msg.put("username", username);
            msg.put("status", "OFFLINE");
            messagingTemplate.convertAndSend("/topic/admin-status", msg);
        } else {
            System.err.println("Disconnect Error: No username found in session attributes!");
        }
    }

    private void updateAdminStatus(String username, boolean status) {
        adminRepository.findById(username).ifPresent(admin -> {
            admin.setIs_logged(status);
            adminRepository.save(admin);
            System.out.println("DB Updated: " + username + " is " + (status ? "ONLINE" : "OFFLINE"));
        });
    }
}