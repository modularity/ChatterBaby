import React, { Component } from 'react';
import {
  View,
  ScrollView,
  WebView
} from 'react-native';
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
      markdown: "#There was an error loading the content.",
    }
    firebase.analytics().setCurrentScreen('faq');
  }

  componentDidMount() {
    //this.getMarkdownContent();
  }

  getMarkdownContent() {
    fetch('https://raw.githubusercontent.com/modularity/ChatterBaby/master/FAQ.md', {method: 'get'})
    .then((response) => {
      if (response.status === 200) this.setState({markdown:response._bodyInit});
    })
    .catch((error) => {
      //firebase.analytics().logEvent('read_faq_error');
    });
  }

  render() {
    return (
      <WebView
        source={{uri: 'https://www.chatterbaby.org/pages/mobile-display/faq'}}
        style={{marginTop: 20}}
      />
      /* markdown text
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Markdown style={markdownStyle}>{this.state.markdown}</Markdown>
        </ScrollView>
      </View>
      */
    );
  }
}
