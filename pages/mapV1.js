import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  Platform
} from "react-native";
//import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import haversine from "haversine";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const Waiting_Driver_Screen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const [run, setRun] = useState(false)
  const [distanceTravel, setDistanceTravel] = useState(0)
  const [locFirst, setLocFirst] = useState(null)
  const [timer, setTimer] = useState(0)

  const [hours, sethours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)


  const [prevLocation, setPrevLocation] = useState([
    {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    },
    {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }
  ])



  function drawerHis() {
    setRun(false)
    setPrevLocation([initialRegion])
    setDistanceTravel(0)
  }

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
    console.log(location, "LOC")

    if (run) {
      setPrevLocation(
        [...prevLocation, initialRegion]
      )
      const distance = haversine(
        locFirst, initialRegion)
      const distancePls = distanceTravel + distance
      setDistanceTravel(distancePls)
      setLocFirst(initialRegion)
    } else {
      console.log('ga maiin')
      if (location) {
        setPrevLocation([
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }
        ])
        setLocFirst({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      }
    }

  };

  useEffect(() => {
    getLocation()
    getLocation()
    console.log('jalan')
  }, [])

  useEffect(() => {
    const time = setInterval(() => {
      if (run === true) {
        getLocation()
        const totalTime = timer + 1
        setTimer(totalTime)
      }
    }, 1000)

    return () => clearInterval(time)
  },);

  function startHandler() {
    setRun(true)
  }


  useEffect(() => {
    sethours(Math.floor(timer / 3600))
    setMinutes(Math.floor((timer % 3600) / 60))
    setSeconds(Math.floor((timer % 60)))
  }, [timer])



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
              <>
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Your Location"
                />
                <Polyline coordinates={prevLocation} strokeWidth={3} />
              </>

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
        <Text style={{ fontSize: 20 }}>Distance: {distanceTravel}</Text>
        <View style={{ fontSize: '100px' }}>
          <Text>{hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</Text>
        </View>
        <TouchableOpacity onPress={() => startHandler()}>
          <Text style={{ fontSize: 20, padding: 10 }}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => drawerHis()}>
          <Text style={{ fontSize: 20, padding: 10 }}>Stop</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Waiting_Driver_Screen;