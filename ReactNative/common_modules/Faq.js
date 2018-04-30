import React, { Component } from 'react';
import {NetInfo,View, ScrollView,Linking,WebView, Text,TouchableOpacity} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import styleSheets
import styles from '../stylesheets/faqStyle';
import markdownStyle from '../stylesheets/markdownStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';
// import FontAwesome to support custom err msg modal
import Icon from 'react-native-vector-icons/FontAwesome';
// convert markdown content into React Native components
import Markdown from 'react-native-markdown-renderer';

export default class Faq extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://www.chatterbaby.org/pages/mobile-display/faq',
      markdown: "",
      isConnected: false,
      key: 1,
      isWebViewUrlChanged: false,
      showMsgModal: false,
    }
    firebase.analytics().setCurrentScreen('faq');
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  render() {
    const errorPage = () => {
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
            <Text style={styles.h1Text}>Unable to connect to the faq link. Please check your internet connection.</Text>
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
          <Text style={styles.h1Text}>Unable to connect to the faq link. Please check your internet connection.</Text>
        </View>
      </View>);
    }
    return (
      <View style={styles.container}>
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={this.state.url}
        style={styles.webView}
        renderError={errorPage}
        onNavigationStateChange={(event) => {
          if (event.url !== this.state.url) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
      </View>
    );
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

/*
  resetWebViewToInitialUrl = () => {
    if (this.state.isWebViewUrlChanged) {
      this.setState({
        key: this.state.key + 1,
        isWebViewUrlChanged: false
      });
    }
  };

  setWebViewUrlChanged = webviewState => {
    if (webviewState.url !== 'https://www.chatterbaby.org/pages/mobile-display/faq') {
      this.setState({ isWebViewUrlChanged: true });
    }
  };
*/
  closeModal() {
    this.setState({showMsgModal: false});
  }
}
