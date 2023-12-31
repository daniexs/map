import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image
} from "react-native";
//import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Waiting_Driver_Screen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const [run, setRun] = useState(false)

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);

    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    console.log(currentLocation, "LOC")
  };

  useEffect(() => {
    getLocation()
    getLocation()
    console.log('jalan')
  }, [])

  useEffect(() => {
    const time = setInterval(() => {
      if (run === true) {
        getLocation();
      }
    }, 1000)

    return () => clearInterval(time)
  },);


  return (
    <>
      <View style={styles.container}>
        {initialRegion && (
          <MapView style={styles.map} initialRegion={initialRegion}
            showsUserLocation
            followsUserLocation
            region={initialRegion}
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>
        )}
        {/* Rest of your code */}
      </View>
      <View>
        <Text style={{ fontSize: 20 }}>Speed: {currentLocation?.speed}</Text>
        <Text style={{ fontSize: 20 }}>Latitude: {currentLocation?.latitude}</Text>
        <Text style={{ fontSize: 20 }}>Longitude: {currentLocation?.longitude}</Text>
        <Text style={{ fontSize: 20 }}>Altitude: {currentLocation?.altitude}</Text>
        <TouchableOpacity onPress={() => setRun(true)}>
          <Text style={{ fontSize: 20, padding: 10 }}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRun(false)}>
          <Text style={{ fontSize: 20, padding: 10 }}>Stop</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Waiting_Driver_Screen;