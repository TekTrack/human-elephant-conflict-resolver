package com.example.jumbowatch.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SmsService{
    @Value("${textLk.senderId}")
    private String SENDER_ID;
    @Value("${textLk.apiKey}")
    private String API_KEY;

    public String sendSms(List<String> phoneNumbers, String message) {

        RestTemplate restTemplate = new RestTemplate();

        String commaSeparatedNumbers = String.join(",", phoneNumbers); // Join all phone numbers with a comma

        String url = UriComponentsBuilder.fromUriString("https://app.text.lk/api/http/sms/send")
            .queryParam("recipient", commaSeparatedNumbers)
            .queryParam("sender_id", SENDER_ID)
            .queryParam("message", message)
            .queryParam("api_token", API_KEY)
            .build()
            .toUriString();
        
        try {
            String response = restTemplate.getForObject(url, String.class);
            System.out.println("Text.lk Response: " + response); // ADD THIS LINE
            return response;
        } catch (Exception e) {
            System.out.println("Connection Error: " + e.getMessage());
            return null;
        }
    }
}