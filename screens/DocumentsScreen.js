import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

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
      setData(jsonData.sockets);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#EBC497" }]}>
      <Image
        source={{
          uri: "https://static.vecteezy.com/system/resources/previews/000/425/287/original/vector-save-icon.jpg",
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>Documentos Guardados</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Icon name="tint" size={20} color="#333" style={styles.icon} />
              <Text style={styles.cardText}>Humedad: {item.humidity}</Text>
            </View>
            <View style={styles.cardRow}>
              <Icon name="thermometer-half" size={20} color="#333" style={styles.icon} />
              <Text style={styles.cardText}>Temperatura: {item.temperature}</Text>
            </View>
            <View style={styles.cardRow}>
              <Icon name="ruler" size={20} color="#333" style={styles.icon} />
              <Text style={styles.cardText}>Distancia: {item.distance}</Text>
            </View>
            <View style={styles.cardRow}>
              <Icon name="lightbulb" size={20} color={item.ledStatus ? "#FFD700" : "#808080"} style={styles.icon} />
              <Text style={styles.cardText}>
                Estado LED: {item.ledStatus ? "Activado" : "Desactivado"}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
      <View style={styles.algo}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 40, 
  },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    marginBottom: 5,
    borderRadius: 5,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
