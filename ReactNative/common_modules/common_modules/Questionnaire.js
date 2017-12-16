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
