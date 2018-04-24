import React, { Component } from 'react';
import { Text, View, ScrollView, Linking, TouchableOpacity, WebView } from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import stylesheets
import styles from '../stylesheets/contactusStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class ContactUs extends Component<{}> {
  constructor(props) {
    super(props);
    firebase.analytics().setCurrentScreen('contactus');
  }
/*
  componentDidMount() {
    var url = 'https://www.chatterbaby.org/pages/mobile-display/contactus';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));

  }
*/
  render() {
    const uri = 'https://www.chatterbaby.org/pages/mobile-display/contactus';
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
      <Text style={styles.title}> Contact Us </Text>
      <Text style={styles.pageText}>If you have any questions, comments or concerns about the research, you can talk to the one of the researchers. Please contact:{'\n'}</Text>
      <Text style={styles.boldText}>
        Ariana Anderson, Ph.D. {'\n'}
        <Text style={styles.pageText}>
          University of California, Los Angeles {'\n'}
          Department of Psychiatry and Biobehavioral Sciences {'\n'}
          760 Westwood Plaza, Ste C8-734 {'\n'}
          Los Angeles, CA 90095-1406
        </Text>
      </Text>
      <TouchableOpacity style={{margin:0, padding:0}}
          onPress={() => Linking.openURL('mailto:to@ariana82@ucla.edu?subject=ChatterBaby')}>
        <Text style={styles.pageText}>ariana82@ucla.edu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{margin:0, padding:0}}
          onPress={() => Linking.openURL('tel:2139737465')}>
        <Text style={styles.pageText}>(213) 973-7465</Text>
      </TouchableOpacity>
      <Text style={styles.pageText}>
        {'\n'}
        If you have questions about your rights while taking part in this study, or you have concerns or suggestions and you want to talk to someone other than the researchers about the study, please call the OHRPP at
      </Text>
      <TouchableOpacity style={{margin:0, padding:0}}
          onPress={() => Linking.openURL('tel:3108257122')}>
        <Text style={styles.pageText}>(310) 825-7122</Text>
      </TouchableOpacity>
      <Text style={styles.pageText}>or write to:{'\n'}</Text>
      <Text style={styles.boldText}>
        UCLA Office of the Human Research Protection Program (OHRPP) {'\n'}
        <Text style={styles.pageText}>
        11000 Kinross Avenue {'\n'}
        Suite 211, Box 951694 {'\n'}
        Los Angeles, CA 90095-1694 {'\n'}
        </Text>
      </Text>
    </ScrollView>
    </View>);
  }

}
