import airsim
import cv2
import numpy as np
import keyboard
import time
import requests
import threading
from datetime import datetime
from ultralytics import YOLO

# --- CONFIGURATION ---
SPEED = 5
TURN_SPEED = 40
CONFIDENCE_THRESHOLD = 0.4
TARGET_DISTANCE_SIZE = 0.30

# 📡 NETWORK SETTINGS
SERVER_URL = "http://127.0.0.1:5000/alert" # Localhost (Change IP if sending to another laptop)
ALERT_INTERVAL = 5 # Seconds
last_alert_time = 0

print("Loading AI...")
model = YOLO('yolov8n.pt') 

print("Connecting to Drone...")
client = airsim.MultirotorClient()
client.confirmConnection()
client.enableApiControl(True)
client.armDisarm(True)
client.takeoffAsync().join()
client.moveToPositionAsync(0, 0, -6, 5).join() 

print("🐘 JUMBO NETWORK: ONLINE")

# --- HELPER FUNCTION: SEND DATA (Background Thread) ---
def send_packet(img, count):
    try:
        # Encode image to JPG format for sending
        _, img_encoded = cv2.imencode('.jpg', img)
        
        # Prepare Data Payload
        payload = {
            'count': str(count),
            'time': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        # Prepare File Payload
        files = {
            'photo': ('alert.jpg', img_encoded.tobytes(), 'image/jpeg')
        }
        
        print(f"📡 Sending Packet (Count: {count})...")
        requests.post(SERVER_URL, data=payload, files=files, timeout=2)
        print("✅ Packet Sent!")
        
    except Exception as e:
        print(f"❌ Failed to send: {e}")

while True:
    responses = client.simGetImages([airsim.ImageRequest("0", airsim.ImageType.Scene, False, False)])
    
    if responses:
        img1d = np.frombuffer(responses[0].image_data_uint8, dtype=np.uint8)
        img_rgb = img1d.reshape(responses[0].height, responses[0].width, 3).copy()
        
        results = model(img_rgb, stream=True, verbose=False)
        
        threat_detected = False
        elephant_count = 0
        target_x = 0 
        target_height = 0 

        for r in results:
            for box in r.boxes:
                conf = float(box.conf[0])
                if conf < CONFIDENCE_THRESHOLD: continue
                
                # We count EVERYTHING detected as a threat for testing
                elephant_count += 1
                
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                label = model.names[int(box.cls[0])]
                
                # Metrics for flight control
                target_x = (x1 + x2) // 2
                target_height = (y2 - y1) / img_rgb.shape[0]

                cv2.rectangle(img_rgb, (x1, y1), (x2, y2), (0, 0, 255), 3)
                threat_detected = True

        # --- 📡 NETWORK LOGIC ---
        # If threat found AND 5 seconds passed since last alert
        if threat_detected and (time.time() - last_alert_time > ALERT_INTERVAL):
            last_alert_time = time.time()
            # Run in a thread so the drone doesn't freeze while uploading!
            t = threading.Thread(target=send_packet, args=(img_rgb, elephant_count))
            t.start()

        # --- FLIGHT CONTROLLER (Same as before) ---
        vx, vy, vz, yaw = 0, 0, 0, 0
        
        if threat_detected and not keyboard.is_pressed('m'):
            img_center = img_rgb.shape[1] // 2
            error_x = (target_x - img_center) / img_center
            yaw = error_x * 50
            
            if target_height < TARGET_DISTANCE_SIZE: vx = 3
            elif target_height > (TARGET_DISTANCE_SIZE + 0.05): vx = -2
            else:
                vx = 0
                vy = 1 
        else:
            if keyboard.is_pressed('w'): vx = SPEED
            if keyboard.is_pressed('s'): vx = -SPEED
            if keyboard.is_pressed('d'): vy = SPEED
            if keyboard.is_pressed('a'): vy = -SPEED
            if keyboard.is_pressed('up'): vz = -SPEED
            if keyboard.is_pressed('down'): vz = SPEED
            if keyboard.is_pressed('left'): yaw = -TURN_SPEED
            if keyboard.is_pressed('right'): yaw = TURN_SPEED

        if keyboard.is_pressed('q'): break

        client.moveByVelocityBodyFrameAsync(vx, vy, vz, duration=5, yaw_mode=airsim.YawMode(is_rate=True, yaw_or_rate=yaw))
        cv2.imshow("Jumbo Network", img_rgb)
    
    cv2.waitKey(1)

client.landAsync().join()
client.enableApiControl(False)
cv2.destroyAllWindows()