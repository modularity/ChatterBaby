import React, { Component } from 'react';
import {
  View,
  Linking,
  WebView,
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import StyleSheet
import styles from '../stylesheets/faqStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class Faq extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      faqUrl: 'https://docs.google.com/document/d/1wXELtFDXSxVaVlRl8HBGEXSfKu1JYgLBEcH2dYJmL50/edit?usp=sharing',
    }
    firebase.analytics().setCurrentScreen('faq');
  }

  openFAQlink() {
    var url = this.state.faqUrl;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        //console.log('Can\'t handle url: ' + url);
        Alert.alert('Connection error', 'Unable to retrieve content, please check your internet connection.');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => {
        //console.error('An error occurred', err));
        Alert.alert('Connection error', 'Unable to retrieve content, please check your internet connection.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.faqUrl}} style={styles.webView} />
      </View>
    );
  }
}
