import React, { Component } from 'react';
import {NetInfo,View, ScrollView,Linking,WebView, Text,TouchableOpacity,Platform} from 'react-native';
// import styleSheets
import styles from '../stylesheets/questionnaireStyle';
// import icon for error handler
import Icon from 'react-native-vector-icons/FontAwesome';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class Questionnaire extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://google.com'
      //url: 'https://www.ctrc.medsch.ucla.edu/redcap/surveys/?s=MJJ43CDT4R',
      //url: 'https://chatterbaby.ctrl.ucla.edu/survey-consented-start',
      // https://staging5.ctrl.ucla.edu:7423/ doesn't have a consented survey
    }
    firebase.analytics().setCurrentScreen('questionnaire');
  }

  render() {
    const url = 'https://google.com';
    if (Platform.OS === 'android') {
      return (<View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.submitBtn} onPress={() => this.openLink()}>
            <Text style={styles.submitText}>
              Begin Survey
            </Text>
          </TouchableOpacity>
        </View>
      </View>);
    }
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri: 'https://www.ctrc.medsch.ucla.edu/redcap/surveys/?s=MJJ43CDT4R'}}
        style={{marginTop: 20}}
        renderError={this.renderOfflineText}
        javaScriptEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        thirdPartyCookiesEnabled={false}
        mixedContentMode={'always'}
        domStorageEnabled={true}
      />
    );
  }

  openLink() {
    Linking.openURL('https://www.ctrc.medsch.ucla.edu/redcap/surveys/?s=MJJ43CDT4R');
  }

  renderOfflineText = () => {
    return (<View style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}> Survey </Text>
      <Text style={styles.pageText}>
      The secondary purpose of this study is to collect infant vocalizations to identify vocal patterns associated with autism and other neurodevelopmental disorders.
      {'\n'}{'\n'}
      Your questionnaire data will be stored in a secure HIPAA compliant server. You may also be given a followup survey(s) when your baby is older regarding whether your infant has been diagnosed with a neurodevelopmental disorder.
      </Text>
    </ScrollView>
    </View>);
  }
}
