import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import stylesheets
import styles from '../stylesheets/contactusStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class ContactUs extends Component<{}> {
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen('contactus');
  }
  // currently hardcoded values but would be nice to make this dynamic
  render() {
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}> Contact Us </Text>
        <Text style={styles.pageText}>If you have any questions, comments or concerns about the research, you can talk to the one of the researchers. Please contact:
            {'\n'}{'\n'}
            <Text style={styles.boldText}>
              Ariana Anderson, Ph.D. {'\n'}
              University of California, Los Angeles {'\n'}
              Department of Psychiatry and Biobehavioral Sciences {'\n'}
            </Text>
            760 Westwood Plaza, Ste C8-734 {'\n'}
            Los Angeles, CA 90095-1406 {'\n'}
            ariana82@ucla.edu {'\n'}
            (213) 973-7465 {'\n'}
            {'\n'}{'\n'}
        If you have questions about your rights while taking part in this study, or you have concerns or suggestions and you want to talk to someone other than the researchers about the study, please call the OHRPP at (310) 825-7122 or write to:
            {'\n'}{'\n'}
            <Text style={styles.boldText}>
              UCLA Office of the Human Research Protection Program (OHRPP) {'\n'}
            </Text>
            11000 Kinross Avenue {'\n'}
            Suite 211, Box 951694 {'\n'}
            Los Angeles, CA 90095-1694 {'\n'}
        </Text>
      </ScrollView>
      </View>
    );
  }
}
