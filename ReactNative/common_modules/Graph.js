import React, { Component } from 'react';
import {Text,View,TouchableOpacity,Dimensions,Modal,FlatList} from 'react-native';
import axios from 'axios';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import form histogram/barchart
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory-native';
// import FontAwesome icons
import Icon from 'react-native-vector-icons/FontAwesome';
// import Firebase for admob and analytics
import firebase from 'react-native-firebase';
// import style sheet
import styles from '../stylesheets/graphStyle';
// import CookieManager
import CookieManager from 'react-native-cookies';

var window = Dimensions.get('window');

export default class Graph extends Component<{}> {

  constructor(props) {
    super(props);
    const { params } = props.navigation.state; // init state from navigation object
    this.state = {
      postRecPreGraph: false,
      painResponse: params.painResponse,
      hungryResponse: params.hungryResponse,
      fussyResponse: params.fussyResponse,
      email: params.email,
      recordId: params.recordId,
      errMsg: '',
      showMsgModal: false,
      showOptLabels: false,
      selectedLabel: false,
      labels: ['Fussy','Hungry','Pain','Diaper Change','Rash','Colic','Ear ache','Fever','Gassy','Scared','Separation','Bored','Sick','Tired','Unknown'],
    }
    firebase.analytics().setCurrentScreen('record');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMessage()}
        {this.renderOptLabel()}
        {this.renderResults()}
        {this.renderBanner()}
      </View>
    );
  }

  renderResults() {
    /*
    <View style={styles.closeContainer}>
      <Text style={styles.title}>Chance my baby is crying</Text>
    </View>
    */
    return(<View style={styles.resultContainer}>
      {this.renderGraph()}
      {this.renderLabelFeedback()}
    </View>);
  }

  renderGraph() {
    var width = window.width/5;
    var height = window.height;
    return (<View><VictoryChart height={height/2.35} domainPadding={width/3.5} padding={{top: width/2, bottom: width, left: width, right:width}} >
      <VictoryAxis independentAxis tickFormat={(x) => (``)} label={"Cry Chance"} />
      <VictoryAxis dependentAxis />
        <VictoryBar horizontal={true}
          data={[{x: 'Pain', y: this.state.painResponse, fill: '#f58357'},
                  {x: 'Hungry', y: this.state.hungryResponse, fill: '#fdba31'},
                  {x: 'Fussy', y: this.state.fussyResponse, fill: '#5f97cb'} ]}
          labels={(d) => (`${Math.floor(d.y)}%`)}
barRatio={0.65}
cornerRadius={10}
style={{ labels: {fontFamily: 'Avenir'} }}
          animate={{ duration: 2000, onLoad: { duration: 1400 } }}
        />
      </VictoryChart></View>);
      /* removing graph onPress handler
      events={[{
        target: "data",
        eventHandlers: {
          onPressOut: (evt, clickedProps) => {
            return { target: 'data', mutation: () => {
              this.pressLabel(clickedProps.datum.xName);
        } } } }
      }]}
      */
  }

  renderLabelFeedback() {
    if (this.state.selectedLabel) return (
      <View><Text style={styles.title}>Thanks, your feedback helps improve the algorithm.</Text></View>
    );
    return (<View>
      <View style={styles.closeContainer}>
        <Text style={styles.title}>Were we right?</Text>
      </View>
      <TouchableOpacity style={styles.feedbackBtn} onPress={ () => this.setState({showOptLabels:true})}>
        <Text style={styles.h1Text}> Teach ChatterBaby about your baby </Text>
      </TouchableOpacity>
    </View>);
  }

  // currently seperated from renderOptLabel FlatList
  renderLabelItem = ({item}) => {
    return (
      <View style={styles.labelContainer}>
        <TouchableOpacity onPress={() => this.pressLabel(item)}>
            <Text style={styles.labelText}>{item}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // currently structured to just support one label per recording
  renderOptLabel() {
    if (this.state.selectedLabel) return null; // will only open if they haven't already selected one
    if (!this.state.showOptLabels) return null; // will open modal with list of labels
    return (<Modal transparent={false} visible={this.state.showOptLabels} animationType={'fade'}
                onRequestClose={() => this.setState({showOptLabels: false})}>
      <View style={styles.labelListContainer}>
        <View style={styles.closeContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={ () => this.setState({showOptLabels: false}) }>
            <Icon name="times" size={15} color='#ecf0f1' />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Select your first choice:</Text>
        <View style={styles.labelsList}>
          <FlatList data={this.state.labels} keyExtractor={(item, index) => item}
                    renderItem={this.renderLabelItem}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true} 
                    ItemSeparatorComponent={() => <View style={{borderWidth: 1, borderColor: '#ccc'}} />}  />
        </View>
      </View>
      </Modal>);
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

  renderBanner() {
    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    //request.addTestDevice();
    request.addKeyword('crying');
    request.addKeyword('infant');
    request.addKeyword('translator');
    request.addKeyword('fussy');
    request.addKeyword('hungry');
    request.addKeyword('sleep');
    request.addKeyword('algorithm');
    request.addKeyword('analyze');
    request.addKeyword('voice');
    request.addKeyword('wipes');

    return (<Banner style={{alignSelf: 'center', margin: 20}}
      unitId={'ca-app-pub-4733123709610330/8392678650'} //ChatterBaby unit ID: wipes
      //unitId={'ca-app-pub-3940256099942544/6300978111'} // test unit ID
      size={'BANNER'}
      request={request.build()}
      onAdLoaded={() => {
        //console.warn('Advert loaded');
      }}
      onAdFailedToLoad={ (err) => {
        if (err.code === 'admob/error-code-internal-error') {
          //console.warn('ad failed to load');
        } else if (err.code === 'admob/error-code-invalid-request') {
          //console.warn('invalid request');
        } else if (err.code === 'admob/error-code-network-error') {
          //console.warn('network error loading ad');
        } else if (err.code === 'admob/error-code-no-fill') {
          //console.warn('ad request successful, but no ad inventory');
        } else if (err.code === 'admob/os-version-too-low') {
          //console.warn('os version too low for ads');
        } //else console.warn('other ad err', err)
      }}
      onAdOpened={() => {
        //console.warn('Advert_opened');
      }}
      onAdClosed={() => {
        //console.warn('Advert Closed');
      }}
      onAdLeftApplication={() => {
        //console.warn('Advert left application');
      }}
    />);
    // placeholder image for the BANNER object
    //return <View style={{alignSelf: 'center', marginBottom: 30, width: 320, height: 50, backgroundColor: '#fff'}} />
  }

  // send label validation to server
  processLabel(label_) {
    // prep fetch API call with formData
    let formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('label', label_);
    formData.append('record_id', this.state.recordId);

    var data = {
      email: this.state.email,
      label: label_,
      record_id: this.state.recordId
    };

    // send formData to server
    // https://staging5.ctrl.ucla.edu:7423/app-ws/
    // need to manually delete cookies before calling API
    CookieManager.clearAll().then((res) => {
      axios.post('https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-label', data)
      .then((response) => {
        //firebase.analytics().logEvent('label_validation');
      })
      .catch((error) => {
        this.setState({showMsgModal: true, errMsg: 'Server error processing the label.'});
        firebase.analytics().logEvent('process_label_server_error');
      });
      firebase.analytics().logEvent('algorithm_validation', { label: label_ });
    });
  }

  // button handler for label validation
  // close modal, call API, remove label validation button below graph(only one user selection per recording)
  pressLabel(label) {
    //Alert.alert('Thanks', 'Your feedback helps improve the algorithm.');
    this.setState({showOptLabels: false, selectedLabel: true});
    this.processLabel(label);
  }
}
