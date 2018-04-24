import React, { Component } from 'react';
import { Text, View, ScrollView, WebView, Linking } from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import stylesheets
import styles from '../stylesheets/aboutusStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class AboutUs extends Component<{}> {
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen('aboutus');
  }
  render() {
    const uri = 'https://www.chatterbaby.org/pages/mobile-display/aboutus';
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        style={{marginTop: 20}}
        renderError={this.renderOfflineText}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }

  renderOfflineText = () => {
    return (<View style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}> About Us </Text>
      <Text style={styles.pageText}>
        The ChatterBaby project is led by Dr. Ariana Anderson along with the Code for the Mission Team: Lauren Dunlap (Mobile Developer), Usha Nookala (Signal Processing), with additional support from the Computing Technologies Research Laboratory (CTRL), the Clinical and Translational Science Institute (CTSI), the Burroughs Wellcome Fund, and the Semel Institute for Neuroscience and Human Behavior at UCLA.
        {'\n'}{'\n'}
        We gratefully acknowledge the many contributions of Abeer Alwan, Delbert Whetter, Sanaz Whetter, Brianna Shaul, Susan Bookheimer, Mirella Dapretto, Don Vaughn, Carol Han, Mahtash Esfandiari, Sherry Eyer, Anne Jackson, UCLA Department of Statistics, UCLA Department of Electrical Engineering, and the OxVoc Team: Christine Parsons and Michelle Craske.
      </Text>
    </ScrollView>
    </View>);
  }
}
