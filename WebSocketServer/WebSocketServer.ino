#include <ArduinoJson.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <DHT.h>

#define DHTPIN D5
#define DHTTYPE DHT11
#define ULTRASONIC_TRIG D7
#define ULTRASONIC_ECHO D6
#define LED_PIN D2

DHT dht(DHTPIN, DHTTYPE);

float h = 0.0;
float t = 0.0;
long distance = 0;
bool ledStatus = false;

ESP8266WiFiMulti WiFiMulti;
ESP8266WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED: {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        webSocket.sendTXT(num, "0");
      }
      break;
    case WStype_TEXT: {
      Serial.printf("[%u] get Text: %s\n", num, payload);
      StaticJsonDocument<200> jsonDocText;
      deserializeJson(jsonDocText, payload);
      if (jsonDocText.containsKey("ledStatus")) {
        ledStatus = jsonDocText["ledStatus"];
        digitalWrite(LED_PIN, ledStatus);
      }
      break;
    }
    case WStype_BIN:
      Serial.printf("[%u] get binary length: %u\n", num, length);
      hexdump(payload, length);
      break;
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(ULTRASONIC_TRIG, OUTPUT);
  pinMode(ULTRASONIC_ECHO, INPUT);
  pinMode(LED_PIN, OUTPUT);
  WiFiMulti.addAP("INFINITUM973B", "pAVvzFd2hb");
  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println(WiFi.localIP());
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  server.begin();
}

void loop() {
  webSocket.loop();
  server.handleClient();

  h = dht.readHumidity();
  t = dht.readTemperature();

  // Lectura del sensor ultrasónico
  digitalWrite(ULTRASONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG, LOW);
  long duration = pulseIn(ULTRASONIC_ECHO, HIGH);
  distance = (duration * 0.0343) / 2; 

 
  digitalWrite(LED_PIN, ledStatus);

 
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["humidity"] = h;
  jsonDoc["temperature"] = t;
  jsonDoc["distance"] = distance;
  jsonDoc["ledStatus"] = ledStatus;

 
  String jsonStr;
  serializeJson(jsonDoc, jsonStr);

 
  webSocket.broadcastTXT(jsonStr);
  Serial.println(jsonStr);

  delay(1000); 
}
