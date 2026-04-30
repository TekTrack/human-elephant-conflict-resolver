package com.example.jumbowatch.controller.sms;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.service.SmsService;

@RestController
@RequestMapping("/api/sms")
public class SmsController {
    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(List<String> phoneNumbers, String message){
        smsService.sendSms(phoneNumbers, message);
        return "SMS sent successfully";
    }
}
