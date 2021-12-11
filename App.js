import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  AppState,
} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import Voice from '@react-native-community/voice';
import Geolocation from 'react-native-geolocation-service';
export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App is working foreground');
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState: ', appState.current);
  };
  const [recording, setRecording] = React.useState();
  const [text, setText] = useState('asdasd');
  const [results, setResults] = useState('');
  const [isGranted, setIsGranted] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    if (Platform.OS === 'ios') {
      // your code using Geolocation and asking for authorisation with

      Geolocation.requestAuthorization('always');
    }
    Geolocation.getCurrentPosition(
      position => {
        console.log('Position', position);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    return () => {
      //Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = e => {
    console.log('start handler', e);
  };
  const onSpeechEndHandler = e => {
    console.log('End handler', e);
  };

  const onSpeechResultsHandler = e => {
    let text = e.value[0];
    setResults(text);
    console.log('onSpeechResultsHandler', e);
  };
  console.log('Results: ' + results);
  const startRecording = async () => {
    RNSoundLevel.start();
    RNSoundLevel.onNewFrame = data => {
      // see "Returned data" section below
      console.log('Sound level info', data);
    };
    try {
      await Voice.start('tr-TR');
    } catch (error) {
      console.log('error  start');
    }
  };
  const stopRecording = async () => {
    RNSoundLevel.stop();
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error adas');
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          <TextInput
            style={styles.textInput}
            value={results}
            placeholder="your text"
            onChangeText={text => setResults(text)}
          />
          <TouchableOpacity onPress={startRecording}>
            <Text style={styles.text}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecording}>
            <Text style={styles.text}>Stop</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Latitude: {latitude}</Text>
          <Text style={styles.text}>Longitude: {longitude}</Text>
          <Text style={styles.active}>{appStateVisible}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 120,
  },
  textInput: {
    width: 240,
    height: 20,
  },
  text: {
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  active: {
    paddingTop: 20,
    color: 'green',
  },
});
