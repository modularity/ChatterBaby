import React, { Component } from 'react';
import { Text, View, WebView, TouchableOpacity, NetInfo } from 'react-native';
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
      isConnected: true,
      url: 'https://www.ctrc.medsch.ucla.edu/redcap/surveys/?s=MJJ43CDT4R',
      //questionURL: 'https://chatterbaby.ctrl.ucla.edu/survey-consented-start',
      // https://staging5.ctrl.ucla.edu:7423/ doesn't have a consented survey
      // old link: https://www.chatterbaby.org/survey-consented-start
    }
    firebase.analytics().setCurrentScreen('questionnaire');
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  closeModal() {
    var _url = this.state.url;
    this.setState({showMsgModal: false, url: ''});
    this.setState({showMsgModal: false, url: _url});
  }

  render() {
    const errorPage = () => {
      return (
        <View style={styles.modalMsgContainer}>
          <View style={styles.modalClose}>
            <TouchableOpacity onPress={() => this.closeModal() }>
              <Icon name="times" size={25} color="#ecf0f1"/>
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeader}>
            <View style={styles.infoRadius}>
              <Icon name="info" size={60} color="#f1592a"/>
            </View>
          </View>
          <View style={styles.modalTxtContainer}>
            <Text style={styles.h1Text}>Unable to connect to the survey link. Please check your internet connection.</Text>
          </View>
        </View>);
    }
    if (!this.state.isConnected) {
      return (<View style={styles.modalMsgContainer}>
        <View style={styles.modalClose}>
          <TouchableOpacity onPress={() => this.closeModal() }>
            <Icon name="times" size={25} color="#ecf0f1"/>
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeader}>
          <View style={styles.infoRadius}>
            <Icon name="info" size={60} color="#f1592a"/>
          </View>
        </View>
        <View style={styles.modalTxtContainer}>
          <Text style={styles.h1Text}>Unable to connect to the survey link. Please check your internet connection.</Text>
        </View>
      </View>);
    }

    return (
      <View style={styles.container}>
         <WebView source={{uri: this.state.url}}
                  style={styles.webView}
                  renderError={errorPage}/>
      </View>
    );
  }
}
