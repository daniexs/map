import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Waiting_Driver_Screen from './pages/mapV1';
import MapRoutes from './pages/mapRoute';
import MapV3 from './pages/mapRouteV3';

export default function App() {
  return (
    // <Waiting_Driver_Screen />
    // <MapRoutes />
    <MapV3 />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
