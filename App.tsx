import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const App = () => {
  const devices = useCameraDevices();
  const device = devices.back; // Use the back camera

  if (device == null) return <View style={styles.container}><Text>Loading...</Text></View>;
  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        // Add more properties according to your needs
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
