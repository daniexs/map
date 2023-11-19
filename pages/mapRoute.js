import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import Constants from "expo-constants"
import { useEffect, useRef, useState } from "react"
import MapViewDirections from "react-native-maps-directions"
import * as Location from "expo-location";


import firebase from "firebase/compat/app"
import { getDatabase, ref, set, onValue } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDAkDtPeQz3DCU_Jq5xQvpk80eP2biJ4OM",
  authDomain: "realtime-tracking-baa73.firebaseapp.com",
  projectId: "realtime-tracking-baa73",
  storageBucket: "realtime-tracking-baa73.appspot.com",
  messagingSenderId: "68954802260",
  appId: "1:68954802260:web:cdaee239294ac7713945c1",
  databaseURL: 'https://realtime-tracking-baa73-default-rtdb.asia-southeast1.firebasedatabase.app'
};
// const app = initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

const { width, height } = Dimensions.get("window")

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const INITIAL_POSITION = {
  latitude: 40.76711,
  longitude: -73.979704,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
}

const GOOGLE_API_KEY = 'AIzaSyBJJ8i1gcnkoBkRx-tqFn9Dam67n2zmJfo'

function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details)
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "id"
        }}
      />
    </>
  )
}



export default function MapV5() {
  const [origin, setOrigin] = useState()
  const [destination, setDestination] = useState()
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const mapRef = useRef(null)
  const [rideGo, setRideGo] = useState(false)
  const [run, setRun] = useState(false)

  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const moveTo = async position => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }

  const edgePaddingValue = 70
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue
  }

  const traceRouteOnReady = args => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance)
      setDuration(args.duration)
    }
  }

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true)
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding })
    }
  }

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0
    }
    set(position)
    moveTo(position)
  }


  function writeUserData(stau, dua) {
    set(ref(db, 'users/' + first), {
      username: first,
      latitude: stau,
      longitude: dua,
    });
  }

  useEffect(() => {
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map(key => ({
        ...data[key]
      }));
      console.log(newData, '------')
      setdataParty(newData)
    });
  }, [])


  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    });
    setCurrentLocation(location.coords);

    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    console.log(location, "LOC")

    if (run) {
      writeUserData(location.coords.latitude, location.coords.longitude)
    }

    // if (run) {
    //   setPrevLocation(
    //     [...prevLocation, initialRegion]
    //   )
    //   const distance = haversine(
    //     locFirst, initialRegion)
    //   const distancePls = distanceTravel + distance
    //   setDistanceTravel(distancePls)
    //   setLocFirst(initialRegion)
    // } else {
    //   console.log('ga maiin')
    //   if (location) {
    //     setPrevLocation([
    //       {
    //         latitude: location.coords.latitude,
    //         longitude: location.coords.longitude,
    //         latitudeDelta: 0.005,
    //         longitudeDelta: 0.005,
    //       }
    //     ])
    //     setLocFirst({
    //       latitude: location.coords.latitude,
    //       longitude: location.coords.longitude,
    //     })
    //   }
    // }

  };

  useEffect(() => {
    getLocation()
    getLocation()
    console.log('jalan')
  }, [])

  useEffect(() => {
    const time = setInterval(() => {
      if (run) {
        getLocation()
        console.log(first)
      }
    }, 1000)

    return () => clearInterval(time)
  },);

  const [dataParty, setdataParty] = useState([])
  const [first, setfirst] = useState('')

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
        // followsUserLocation
        showsCompass={true}
        // showsUserLocation
        region={initialRegion}
      // followsUserLocation
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
        {currentLocation && (
          <>
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />
          </>

        )}
        {dataParty.map((el, i) => {
          return <Marker key={i} coordinate={{ latitude: el.latitude, longitude: el.longitude }} title={el.username} />
        })}
      </MapView>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => setRun(true)}>
          <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setRun(false)}>
          <Text style={styles.buttonText}>Stop Trace</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          onChangeText={newText => setfirst(newText)}
          defaultValue={first}
        />
      </View>
      {rideGo && (
        <View style={styles.searchContainer}>
          <InputAutocomplete
            label="Origin"
            onPlaceSelected={details => {
              onPlaceSelected(details, "origin")
            }}
          />
          <InputAutocomplete
            label="Destination"
            onPlaceSelected={details => {
              onPlaceSelected(details, "destination")
            }}
          />
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Trace route</Text>
          </TouchableOpacity>
          {distance && duration ? (
            <View>
              <Text>Distance: {distance.toFixed(2)}</Text>
              <Text>Duration: {Math.ceil(duration)} min</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 0.9
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight
  },
  input: {
    borderColor: "#888",
    borderWidth: 1
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4
  },
  buttonText: {
    textAlign: "center"
  }
})
