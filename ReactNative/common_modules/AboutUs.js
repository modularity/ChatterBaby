import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';

export default class AboutUs extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> About Us </Text>
        <Text style={styles.pageText}>
          The ChatterBaby project is led by Dr. Ariana Anderson along with the Code for the Mission Team: Lauren Dunlap (Android developer), Yining Zhao (iOS developer), Usha Nookala (signal processing), with additional support from the Computing Technologies Research Laboratory (CTRL), the Clinical and Translational Science Institute (CTSI), the Burroughs Wellcome Fund, and the Semel Institute for Neuroscience and Human Behavior at UCLA.
          {'\n'}{'\n'}
          We gratefully acknowledge the many contributions of Abeer Alwan, Delbert Whetter, Sanaz Whetter, Brianna Shaul, Susan Bookheimer, Mirella Dapretto, Don Vaughn, Carol Han, Mahtash Esfandiari, Sherry Eyer, Anne Jackson, UCLA Department of Statistics, UCLA Department of Electrical Engineering, and the OxVoc Team: Christine Parsons and Michelle Craske.
        </Text>
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
  title: {
    padding: 30,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pageText: {
    color: '#333333',
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold'
  }
});
