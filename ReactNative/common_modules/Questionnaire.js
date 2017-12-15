import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  Dimensions
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';

export default class Questionnaire extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      questionURL: 'https://www.chatterbaby.org/survey-consented-start',
    }
  }

  render() {
    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.questionURL}} style={styles.webView} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  webView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.9,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
