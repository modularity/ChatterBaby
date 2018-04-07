import React, { Component } from 'react';
import {View, ScrollView, WebView, Text} from 'react-native';
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
      markdown: "",
    }
    firebase.analytics().setCurrentScreen('faq');
  }

  componentDidMount() {
    //this.getMarkdownContent();
  }
/*
  getMarkdownContent() {
    fetch('https://raw.githubusercontent.com/modularity/ChatterBaby/master/FAQ.md', {method: 'get'})
    .then((response) => {
      if (response.status === 200) this.setState({markdown:response._bodyInit});
    })
    .catch((error) => {
      firebase.analytics().logEvent('read_faq_error');
    });
  }
*/
  render() {
    const errorPage = () => {
      return (<View style={styles.modalMsgContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.infoRadius}>
              <Icon name="info" size={60} color="#f1592a"/>
            </View>
          </View>
          <View style={styles.modalTxtContainer}>
            <Text style={styles.h1Text}>Unable to connect to the faq link. Please check your internet connection.</Text>
          </View>
          <Icon.Button name="refresh" backgroundColor="#fdba31" onPress={() => this.forceUpdate()}>
            <Text style={{fontFamily: 'Arial', fontSize: 15}}>Retry</Text>
          </Icon.Button>
        </View>);
    }
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: 'https://www.chatterbaby.org/pages/mobile-display/faq'}}
          style={styles.webView}
          renderError={errorPage} />
      </View>
    );
  }
}
