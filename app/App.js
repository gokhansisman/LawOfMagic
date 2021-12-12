import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  AppState,
} from "react-native";
import RNSoundLevel from "react-native-sound-level";
import Voice from "@react-native-community/voice";
import Geolocation from "react-native-geolocation-service";

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App is working foreground");
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState: ", appState.current);
  };
  const [priority, setPriority] = React.useState("normal");

  const [volume, setVolume] = useState(null);
  const [results, setResults] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  let lat = 0;
  let lng = 0;
  let _text = "";
  const dangerousWords = [
    "öldür",
    "kes",
    "nefret",
    "mezar",
    "vur",
    "döv",
    "kır",
  ];

  useEffect(() => {
    if (results.includes("öldürmek")) {
      console.log("tehlike..");
      setPriority("high");
    }
    if (volume > -10) {
      console.log("ses yüksek");
    }
    if (appStateVisible === "background") {
      console.log("inbackground");
    }
  });

  const detectDanger = (text) => {
    _text = ""
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat: lat, lng: lng }),
    };

    for (let word of dangerousWords) {
      if (text.includes(word) && volume > -10) {
        console.log("istek");
        fetch("http://localhost:8080/api/coordinate", settings)
          .then((res) => res.json())
          .then((res) => console.log(res));
        break;
      }
    }
  };
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    getLocation();
    return () => {
      //Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const getLocation = () => {
    if (Platform.OS === "ios") {
      // your code using Geolocation and asking for authorisation with

      Geolocation.requestAuthorization("always");
    }
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("Position", position);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  const onSpeechStartHandler = (e) => {
    console.log("start handler", e);
  };
  const onSpeechEndHandler = (e) => {
    console.log("End handler", e);
  };
  console.log("Level: ", volume);
  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    _text = text;
    setResults(text.toLowerCase());
    console.log("onSpeechResultsHandler", e);
  };
  useEffect(() => {
    setInterval(function () {
      startRecording();
      setTimeout(stopRecording, 2800);
    }, 3000);
  }, []);

  const startRecording = async () => {
    RNSoundLevel.start();
    RNSoundLevel.onNewFrame = (data) => {
      // see "Returned data" section below
      setVolume(data.rawValue);
      setIsListening(true);
    };
    try {
      await Voice.start("tr-TR");
    } catch (error) {
      console.log("error  start");
    }
  };
  const stopRecording = async () => {
    RNSoundLevel.stop();
    setIsListening(false);
    detectDanger(_text.toLowerCase());

    try {
      await Voice.stop();
    } catch (error) {
      console.log("error adas");
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View>
          {isListening && (
            <Image
              style={styles.listeningGif}
              source={require("./sound.gif")}
            />
          )}
          <Text style={priority === "normal" ? styles.normal : styles.high}>
            Priority: {priority}
          </Text>
          <TextInput
            style={styles.textInput}
            value={results}
            placeholder="your text"
            onChangeText={(text) => setResults(text)}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={startRecording}>
              <Text style={styles.text}>Start</Text>
              <Image
                style={styles.logo}
                source={{
                  uri: "https://www.iconpacks.net/icons/1/free-microphone-icon-342-thumb.png",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.text}>Stop</Text>
              <Image
                style={styles.logo}
                source={{
                  uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-pause-512.png",
                }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.locationHeader}>Location</Text>
          <Text style={styles.text}>Latitude: {latitude}</Text>
          <Text style={styles.text}>Longitude: {longitude}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 120,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textInput: {
    width: 240,
    height: 20,
  },
  text: {
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  locationHeader: {
    paddingTop: 20,
    color: "green",
  },
  normal: {
    color: "green",
  },
  high: {
    color: "red",
  },
  logo: {
    marginTop: 4,
    width: 20,
    height: 18,
    marginLeft: 4,
    cursor: "pointer",
  },
  listeningGif: {
    width: 50,
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
