from flask import Flask, request
import os
from datetime import datetime

app = Flask(__name__)
SAVE_FOLDER = "elephant_alerts"

if not os.path.exists(SAVE_FOLDER):
    os.makedirs(SAVE_FOLDER)

@app.route('/alert', methods=['POST'])
def receive_alert():
    # 1. Get Data (Now includes Coordinates!)
    elephant_count = request.form.get('count')
    alert_time = request.form.get('time')
    lat = request.form.get('latitude')
    lon = request.form.get('longitude')
    
    # 2. Get Photo
    if 'photo' not in request.files: return "No photo", 400
    photo = request.files['photo']
    
    # 3. Save Evidence
    filename = f"{SAVE_FOLDER}/alert_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    photo.save(filename)
    
    # 4. Print Notification
    print("\n" + "="*40)
    print(f"🚨 JUMBO ALERT RECEIVED!")
    print(f"🐘 Count: {elephant_count}")
    print(f"📍 GPS:   {lat}, {lon}")
    print(f"⏰ Time:  {alert_time}")
    print(f"📁 Photo: {filename}")
    print("="*40)
    
    return "Alert Received", 200

if __name__ == '__main__':
    print("📡 Receiver Server Online at http://0.0.0.0:5000/alert")
    app.run(host='0.0.0.0', port=5000)