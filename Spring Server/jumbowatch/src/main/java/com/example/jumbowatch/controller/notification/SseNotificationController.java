package com.example.jumbowatch.controller.notification;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.example.jumbowatch.model.Notification;

import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@CrossOrigin(origins = "*")
public class SseNotificationController {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping(value = "/api/admin/notification", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Keeps connection open forever
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    // Call this to push data to the React app
    public void pushAlert(Notification notification) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(notification, MediaType.APPLICATION_JSON);
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}