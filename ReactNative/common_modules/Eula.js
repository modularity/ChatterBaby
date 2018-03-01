import React, { Component } from 'react';
import {
  AsyncStorage,
  Text,
  View,
  WebView,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
// import for navigation
import Register from './Register';
// import stylesheets
import styles from '../stylesheets/eulaStyle';
import markdownStyle from '../stylesheets/markdownStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';
// import FontAwesome icons for error message modal
import Icon from 'react-native-vector-icons/FontAwesome';
// convert markdown content into React Native components
import Markdown from 'react-native-markdown-renderer';

export default class Eula extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      showMsgModal: false,
      errMsg: '',
      markdown: "#There was an error loading the content.",
    }
    firebase.analytics().setCurrentScreen('eula');
  }

  componentDidMount() {
    this.getMarkdownContent();
  }

  render() {
    return (
      <View style={styles.container}>
      {this.renderMessage()}
      {this.renderEula()}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => this.setState({showMsgModal: true, errMsg: 'This app is part of a clinical trial. To continue, you must first agree to the consent terms.'})}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.consentBtn} onPress={() => this.agreeBtn()}>
          <Text style={styles.consentText}>I Agree</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }

  getMarkdownContent() {
    fetch('https://raw.githubusercontent.com/modularity/ChatterBaby/master/ConsentForm.md', {method: 'get'})
    .then((response) => {
      if (response.status === 200) this.setState({markdown: response._bodyInit});
    })
    .catch((error) => {
      firebase.analytics().logEvent('read_eula_error');
    })
  }

  // display converted markdown content for consent form
  renderEula() {
    const rules = {
      hardbreak: (node, children, parent, styles) =>
        <Text key={node.key}></Text>,
      softbreak: (node, children, parent, styles) =>
        <Text key={node.key}></Text>,
    };

    return (<ScrollView>
              <Markdown style={markdownStyle} rules={rules}>
                {this.state.markdown}
              </Markdown>
            </ScrollView>);
    /*
    return(<WebView source={{uri: this.state.consentLink}}
             style={styles.webView}
             automaticallyAdjustContentInsets={false}
             javaScriptEnabled={false} />);
    */
  }

  // display user error messages
  renderMessage() {
    return (<Modal transparent={false} visible={this.state.showMsgModal} animationType={'fade'}
           onRequestClose={() => this.setState({showMsgModal: false}) }>
      <View style={styles.modalMsgContainer}>
        <View style={styles.modalClose}>
          <TouchableOpacity onPress={() => this.setState({showMsgModal: false}) }>
            <Icon name="times" size={25} color="#ecf0f1"/>
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeader}>
          <View style={styles.infoRadius}>
            <Icon name="info" size={60} color="#f1592a"/>
          </View>
        </View>
        <View style={styles.modalTxtContainer}>
          <Text style={styles.h1Text}>{this.state.errMsg}</Text>
        </View>
      </View>
    </Modal>);
  }

  // update the local storage that the user agrees to EULA
  // route the user to the questionnaire page
  async agreeBtn() {
    try {
      await AsyncStorage.setItem('consented', 'true');
      firebase.analytics().logEvent('consent_agreed');
      this.props.navigation.navigate('Register');
    } catch (error) {
      this.setState({showMsgModal: true, errMsg: 'Error saving consent progress.'});
      firebase.analytics().logEvent('consented_device_storage_error');
    }
  }

}
