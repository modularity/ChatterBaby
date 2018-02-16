import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  WebView,
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import StyleSheet
import styles from '../stylesheets/questionnaireStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class Questionnaire extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      questionURL: 'https://chatterbaby.ctrl.ucla.edu/survey-consented-start',
      // https://staging5.ctrl.ucla.edu:7423/ doesn't have a consented survey
      // old link: https://www.chatterbaby.org/survey-consented-start
    }
    firebase.analytics().setCurrentScreen('questionnaire');
  }

  render() {
    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.questionURL}} style={styles.webView} />
      </View>
    );
  }
}
