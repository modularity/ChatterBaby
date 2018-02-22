import React, { Component } from 'react';
import { Text, View, WebView } from 'react-native';;
// import StyleSheet
import styles from '../stylesheets/questionnaireStyle';
// import icon for error handler
import Icon from 'react-native-vector-icons/FontAwesome';
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
    const errorPage = () => {
      return (<View style={styles.modalMsgContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.infoRadius}>
              <Icon name="info" size={60} color="#f1592a"/>
            </View>
          </View>
          <View style={styles.modalTxtContainer}>
            <Text style={styles.h1Text}>Unable to connect to the survey link.</Text>
          </View>
        </View>);
    }

    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.questionURL}}
                  style={styles.webView}
                  renderError={errorPage}/>
      </View>
    );
  }
}
