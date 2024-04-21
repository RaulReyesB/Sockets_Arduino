import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DocumentsScreen from "./screens/DocumentsScreen";
import HomeScreen from "./screens/HomeScreen";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <Image
                source={{
                  uri: "https://static.vecteezy.com/system/resources/previews/008/249/584/original/modern-hexagon-technology-logo-design-template-vector.jpg",
                }}
                style={styles.logo}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("DocumentsScreen")}
                style={styles.addButton}
              >
                <Text style={styles.addButtonLabel}>Ver documentos</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="DocumentsScreen"
          component={DocumentsScreen}
          options={{
            title: "Agregar Nuevo Producto",
            headerTitleStyle: styles.headerTitle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  addButton: {
    marginRight: 15,
    padding: 10,
  },
  addButtonLabel: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#D62839",
  },
  logo: {
    width: 150,
    height: 40,
    resizeMode: "contain",
    marginLeft: -50
  },
});

export default App;