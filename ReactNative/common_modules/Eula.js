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

export default class Eula extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      agree: false,
      //publish w larger font test // consentLink: 'https://docs.google.com/document/d/e/2PACX-1vQqqLWWYMhQl51PRu6fAFH60gTSAsIfzjYVt9p0NwPdL6oro8CbSAuDgTb1WTqtFKN-iIPpxMEM9nrq/pub'
      consentLink: 'https://docs.google.com/document/d/e/2PACX-1vSM3K9gyNKUv0kUVDojayGfWY-lzeeZJXhpDxCfjpXQeC7sLCVKDU5k5I6OpNBt5gzgvbWthyr_UUH-/pub'
      //direct link but has navbar //consentLink: 'https://docs.google.com/document/d/1Kk5sS_TZco67vvpb4SCk9bvGAR89szXWqlye-AhISpo/edit?usp=sharing'
    }
  }

  // update the local storage that the user agrees to EULA
  // route the user to the questionnaire page
  async agreeBtn() {
    try {
      await AsyncStorage.setItem('consentResponse', 'agree');
    } catch (error) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  webView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
  },
  cancelText: {
    color: 'white',
    fontSize: 20,
  },
  consentBtn: {
    backgroundColor: '#5f97cb',
    padding: 10
  },
  consentText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
