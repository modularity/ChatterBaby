import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  Linking,
  WebView,
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import StyleSheet
import styles from '../stylesheets/faqStyle';

export default class Faq extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      faqUrl: 'https://docs.google.com/document/d/1wXELtFDXSxVaVlRl8HBGEXSfKu1JYgLBEcH2dYJmL50/edit?usp=sharing',
    }
  }

  openFAQlink() {
    var url = this.state.faqUrl;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) { console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.faqUrl}} style={styles.webView} />
      </View>
    );
  }
}
