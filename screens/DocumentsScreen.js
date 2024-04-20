import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

export default function DocumentsScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://json-arduino.onrender.com/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData.sockets); // Asignar jsonData.sockets en lugar de jsonData
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documentos Guardados</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Humedad: {item.humidity}</Text>
            <Text>Temperatura: {item.temperature}</Text>
            <Text>Distancia: {item.distance}</Text>
            <Text>
              Estado LED: {item.ledStatus ? "Activado" : "Desactivado"}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
