package com.example.jumbowatch.controller.sms;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jumbowatch.model.JwtUtil;
import com.example.jumbowatch.model.User;
import com.example.jumbowatch.repository.UserRepository;
import com.example.jumbowatch.service.SmsService;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    @Autowired
    private UserRepository userRepository;
     @Autowired
    private JwtUtil jwtUtil;

    private final SmsService smsService;

    //To Strore OTP
    private Map<String, String> otpStorage = new HashMap<>();

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(List<String> phoneNumbers, String message){
        smsService.sendSms(phoneNumbers, message);
        return "SMS sent successfully";
    }


    //OTP Genaration
    protected String generateOTP(){
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp); 
    }

    //Check if the phone number is Allready registerd
    protected boolean isRegistered(String phoneNumber){
        if(!userRepository.existsByPhoneNumber(phoneNumber)){
            return false;
        }
        return true;
    }

    // @PostMapping("/send-otp")
    // public String sendOTP(@RequestBody Map<String, String> payload){
    // try{
    //     String phoneNumber = payload.get("phone");


    //     System.out.println("I am Hit");

    //     if(!isRegistered(phoneNumber)){
    //         return "Error : This Number is Not Registerd";

    //     }

    //   String otp = generateOTP();
    //     otpStorage.put(phoneNumber, otp);

    //     String message = "JumboWatch Verification Code: " + otp + ".Please Do Not Share this With Others";
    //     smsService.sendSms(List.of(phoneNumber), message);

    //     return "OTP SuccessFully Sent.";

    // } catch (Exception e){
        
    //     return "Error Happens When sending OTP";

    // }
   
    // }

@PostMapping("/send-otp")
public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> payload) {
    try {
        String phoneNumber = payload.get("phone");

        System.out.println("I am Hit");

        if (!isRegistered(phoneNumber)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Error: This Number is Not Registered", "status", HttpStatus.NOT_FOUND.value()));
        }

        String otp = generateOTP();
        otpStorage.put(phoneNumber, otp);

        String message = "JumboWatch Verification Code: " + otp + ". Please Do Not Share this With Others.";
        smsService.sendSms(List.of(phoneNumber), message);

        return ResponseEntity.ok(Map.of(
            "message", "OTP Successfully Sent.",
            "status", HttpStatus.OK.value()
        ));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "message", "An error occurred while sending OTP",
                    "status", HttpStatus.INTERNAL_SERVER_ERROR.value()
                ));
    }
}


    @PostMapping("/verify-otp")
public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
    try {
        String phoneNumber = request.get("phone");
        String otp = request.get("otp");
        String storedOtp = otpStorage.get(phoneNumber);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Invalid or expired OTP"));
        }

        User user = userRepository.getuserfomPhone(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found for this phone number"));

        otpStorage.remove(phoneNumber);
        String token = jwtUtil.generateToken(user.getPhoneNumber()); 

         Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("status", HttpStatus.OK.value());
                response.put("token", token);
                response.put("role","user");
                response.put("data", user);

        return ResponseEntity.ok(response);

    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(Map.of("message", "An error occurred during verification"));
    }
}
}
    

