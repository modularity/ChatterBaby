import React, { Component } from 'react';
import {Text,View,TouchableOpacity,Dimensions,Modal,FlatList} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import form histogram/barchart
import { VictoryChart, VictoryBar, VictoryAxis  } from 'victory-native';
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
      recordid: params.recordid,
      errMsg: '',
      showMsgModal: false,
      showOptLabels: false,
      selectedLabel: false,
      labels: ['Fussy','Hungry','Pain','Diaper Change','Rash','Colic','Gassy','Scared','Separation','Bored'],
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
    return(<View style={styles.resultContainer}>
      <View style={styles.closeContainer}>
        <Text style={styles.title}>Chance my baby is crying</Text>
      </View>
      {this.renderGraph()}
      {this.renderLabelFeedback()}
    </View>);
  }

  renderGraph() {
    var width = window.width/5;
    var height = window.height;
    // to support banner in responsive layout, update VictoryChart height={height/3}
    return (<View><VictoryChart height={height/2.7} domainPadding={width/3} padding={{top: width/2, bottom: width, left: width, right:width}} >
      <VictoryAxis independentAxis tickFormat={(x) => (``)} label={"Chances"} />
      <VictoryAxis dependentAxis style={{margin:10}} />
        <VictoryBar horizontal={true}
          data={[{x: 'Pain', y: this.state.painResponse, fill: '#f58357'},
                  {x: 'Hungry', y: this.state.hungryResponse, fill: '#fdba31'},
                  {x: 'Fussy', y: this.state.fussyResponse, fill: '#5f97cb'} ]}
          labels={(d) => (`${Math.floor(d.y)}%`)}
          animate={{ duration: 2000, onLoad: { duration: 1500 } }}
          events={[{
            target: "data",
            eventHandlers: {
              onPressOut: (evt, clickedProps) => {
                return { target: 'data', mutation: () => {
                  this.pressLabel(clickedProps.datum.xName);
            } } } }
          }]}
        />
      </VictoryChart></View>);
  }

  renderLabelFeedback() {
    if (this.state.selectedLabel) return null;
    return (<View>
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
        <Text style={styles.title}>Select your first choice:</Text>
        </View>
        <View style={styles.labelsList}>
          <FlatList data={this.state.labels} keyExtractor={(item, index) => item}
                    renderItem={this.renderLabelItem}
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
    request.addKeyword('baby')
    request.addKeyword('parenting');

    return (<Banner style={{alignSelf: 'center'}}
      unitId={'ca-app-pub-4412913872988371/2373554464'} //ChatterBaby unit ID
      //unitID={'ca-app-pub-4412913872988371/6451389174'} //chatterbaby unit ID
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
    // returns a placeholder image for the BANNER object
    //return <View style={{alignSelf: 'center', marginBottom: 30, width: 320, height: 50, backgroundColor: '#fff'}} />
  }

  // send label validation to server
  processLabel(label_) {
    // prep fetch API call with formData
    let formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('label', label_);
    formData.append('record_id', this.state.recordid);

    // send formData to server
    // https://staging5.ctrl.ucla.edu:7423/app-ws/
    // need to manually delete cookies before calling API
    CookieManager.clearAll().then((res) => {
      fetch('https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-label', {
        method: 'post',
        body: formData
      })
      .then((response) => {
        console.log('label response', response);
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
