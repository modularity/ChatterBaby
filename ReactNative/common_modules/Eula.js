import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  Dimensions,
  TouchableHighlight
} from 'react-native';
// import for navigation
import Register from './Register';
// import stylesheets
import styles from '../stylesheets/eulaStyle';

export default class Eula extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      agree: false,
      consentLink: 'https://docs.google.com/document/d/e/2PACX-1vSM3K9gyNKUv0kUVDojayGfWY-lzeeZJXhpDxCfjpXQeC7sLCVKDU5k5I6OpNBt5gzgvbWthyr_UUH-/pub'
      //direct link but has navbar //consentLink: 'https://docs.google.com/document/d/1Kk5sS_TZco67vvpb4SCk9bvGAR89szXWqlye-AhISpo/edit?usp=sharing'
    }
  }

  // update the local storage that the user agrees to EULA
  // route the user to the questionnaire page
  async agreeBtn() {
    try {
      await AsyncStorage.setItem('consentResponse', 'agree');
      console.log('just agreed to consent');
    } catch (error) {
      console.log('error with saving consent');
      // error saving data
    }
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView source={{uri: this.state.consentLink}}
                 style={styles.webView}
                 automaticallyAdjustContentInsets={false}
                 javaScriptEnabled={false} />
        <View style={styles.buttonRow}>
          <TouchableHighlight style={styles.cancelBtn} onPress={() => Alert.alert('Note','To use the app, you must agree to the consent terms.')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.consentBtn} onPress={() => this.agreeBtn()}>
            <Text style={styles.consentText}>I Agree</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
