# try-mqtt

try-mqtt 是一個超簡單的MQTT client，其中包含subscribe以及簡易publish功能。主要是自己寫來測試MQTT連線而使用。  

![image](https://raw.githubusercontent.com/WayneChang65/try-mqtt/master/images/mqtt_main.gif)  

## 這專案能做什麼事？ (What can it do ?)

* Subscribe某個MQTT Broker的某個Topic (目前Topic已在程式裏寫死，連到自己架設的Broker裏的 wayne65/# )
* Publish測試訊息到某個Broker。(目前Publish "It works!"到wayne65/test1 topic裏)

## 如何跑範例程式？ (How to run the example ?)

* 從Github下載try-mqtt專案程式碼。  

```bash
git clone https://github.com/WayneChang65/try-mqtt.git
```

* 進入try-mqtt專案目錄  

```bash
cd try-mqtt
```

* 下載跑範例程式所需要的環境組件  

```bash
npm install
```

* 透過以下格式輸入指令，執行Subscribe功能

```bash
node index.js subscribe
```

* 透過以下格式輸入指令，執行Publish功能。(後面100代表100ms publish一筆，數字可換)

```bash
node index.js publish 100
```
