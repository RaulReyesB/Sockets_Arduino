import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

const socket = new WebSocket("ws://192.168.1.139:81");

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [humidityData, setHumidityData] = useState(0);
  const [temperatureData, setTemperatureData] = useState(0);
  const [mq2Data, setMq2Data] = useState(0);
  const [pirData, setPirData] = useState(0);

  useEffect(() => {
    socket.onopen = () => {
      console.log("Conectado al servidor WebSocket");
      setIsConnected(true);
    };

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      setHumidityData(data.humidity);
      setTemperatureData(Math.floor(data.temperature));
      setMq2Data(data.distance);
      setPirData(data.ledStatus);
    };
  }, []);

  const enviarDatos = async () => {
    try {
      const data = {
        humidity: humidityData,
        temperature: temperatureData,
        distance: mq2Data,
        ledStatus: pirData,
      };
      const response = await fetch("https://json-arduino.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to send data to server");
      }
      console.log("Data sent successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLED = () => {
    const newLEDStatus = !pirData;
    setPirData(newLEDStatus);
    socket.send(JSON.stringify({ ledStatus: newLEDStatus }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.connectionContainer}>
          <Image
            source={{
              uri: "https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-reading-icon-png-image_4278633.jpg",
            }}
            style={styles.connectionIcon}
          />
          <Text style={styles.connectionText}>
            {isConnected ? "CONECTADO" : "NO CONECTADO"}
          </Text>
        </View>
        <Text style={styles.data}>Humedad: {humidityData}</Text>
        <Text style={styles.data}>Temperatura: {temperatureData}</Text>
        <Text style={styles.data}>Distancia: {mq2Data}</Text>
        <Text style={styles.data}>
          Led Value: {pirData ? "Encendido" : "Apagado"}
        </Text>
        <View style={styles.buttonContainer}>
          <Button title="Enviar" onPress={enviarDatos} color="#b52c00" />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={pirData ? "Apagar LED" : "Encender LED"}
            onPress={toggleLED}
            color="#b52c00"
          />
        </View>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBC497",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#e0e0e0",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
  },
  connectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  connectionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  connectionText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  data: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    width: 200,
    alignSelf: "center",
    marginVertical: 10,
  },
});
