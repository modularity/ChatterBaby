import React, { Component } from 'react';
import {
  Alert,
  Platform,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Picker,
  FlatList,
} from 'react-native';
// import library for navigation objects and routing
import { StackNavigator, TabNavigator } from 'react-navigation';
// import to record audio
import { AudioRecorder, AudioUtils } from 'react-native-audio';
// import for progress bar
import * as Progress from 'react-native-progress';
// import form histogram/barchart
import { VictoryChart, VictoryBar, VictoryAxis, Bar } from 'victory-native';
//import { Bar } from 'react-native-pathjs-charts';
// import FontAwesome icons
import Icon from 'react-native-vector-icons/FontAwesome';
// import Firebase for admob and analytics
import Firebase from 'react-native-firebase';
// import style sheet
import styles from '../stylesheets/recordStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';
// import list feature for label validation
//import { List, ListItem } from 'react-native-elements';

export default class Record extends Component<{}> {

  constructor(props) {
    super(props);
    let path = AudioUtils.DocumentDirectoryPath + '/audioTest.AAC';
    this.state = {
      showChart: false,
      progress: 0,
      currentTime: 0.0,
      stoppedRecording: false,
      audioPath: path,
      hasPermission: undefined,
      painResponse: 25,
      hungryResponse: 35,
      fussyResponse: 40,
      email: '',
      recordid: 0,
      errMsg: '',
      showMsgModal: false,
      showOptLabels: false,
      selectedLabel: false,
      labels: ['Fussy', 'Hungry', 'Pain','Diaper Change', 'Rash', 'Colic', 'Gassy', 'Scared', 'Seperation', 'Bored'],
    }
    firebase.analytics().setCurrentScreen('record');
  }

  componentDidMount() {
    // pull email from app.js navigator props
    const email = this.props.screenProps.email;
    if (email) this.setState({email});

    // check permission, if okay then configure AudioRecorder
    this.checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });
      if (!hasPermission) return;
      this.prepareRecordingAtPath(this.state.audioPath);
      AudioRecorder.onProgress = (data) => {
        var floorTime = Math.floor(data.currentTime);
        if (floorTime == 5) {
          this.stop();
        } else {
          this.setState({progress: data.currentTime, currentTime: floorTime});
          //console.log("onProgress data", data);
        }
      };
      AudioRecorder.onFinished = (data) => {
        //console.log("onFinished data", data); // returning null on android
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === 'OK', data.audioFileURL);
        }
      };
    });
  }

  render() {
    // renderContent: conditional variable to render either recording UI or result graph
    var renderContent = (
    <View style={styles.resultContainer}>
      <View style={styles.closeContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={ () => this.setState({showChart: false, selectedLabel: false}) }>
          <Icon name="times" size={15} color='#ecf0f1' />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Why is baby crying?</Text>
        {this.renderGraph()}
        {this.renderLabelFeedback()}
      </View>);



    // update renderContent to show recording UI
    if ( !this.state.showChart ) {
      renderContent = <View style={styles.recordContainer}>
        <Progress.Circle style={{ justifyContent: 'center', alignItems: 'center' }}
                        progress={ this.state.progress/5 } size={300} thickness={5}
                        color={'#5f97cb'} borderWidth={0} />
        <View style={styles.recordButton}>
          {this.renderButton('Record', () => { this.record() }, this.state.recording ) }
        </View>
      </View>
    };

    return (
      <View style={styles.container}>
        {this.renderMessage()}
        {this.renderOptLabel()}
        { renderContent }
        {this.renderBanner()}
      </View>
    );
  }

  renderGraph() {
    return (<View><VictoryChart domainPadding={30} >
      <VictoryAxis independentAxis tickFormat={(x) => (`${x}%`)} />
      <VictoryAxis dependentAxis style={{margin:10}} />
        <VictoryBar horizontal={true}
          data={[{x: 'Pain', y: this.state.painResponse, fill: '#f58357'},
                  {x: 'Hungry', y: this.state.hungryResponse, fill: '#fdba31'},
                  {x: 'Fussy', y: this.state.fussyResponse, fill: '#5f97cb'} ]}
          labels={(d) => Math.floor(d.y)}
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
      <Text style={styles.feedbackText}>Teach ChatterBaby about you!{'\n'}Select your first choice in the graph above or options below. </Text>
      <TouchableOpacity style={styles.confirmBtn} onPress={ () => this.setState({showOptLabels:true})}>
        <Text style={styles.h1Text}> Options </Text>
      </TouchableOpacity>
    </View>);
  }

  // currently seperated from renderOptLabel FlatList
  renderLabelItem = ({item}) => {
    // currently pressLabel for testing, will update to processLabel api call
// <Icon name="circle-o" size={10} color="#777" />
// <View style={styles.labelItem}>
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
      <View style={styles.resultContainer}>
        <View style={styles.closeContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={ () => this.setState({showOptLabels: false}) }>
            <Icon name="times" size={15} color='#ecf0f1' />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Select your first choice:</Text>
        <View style={styles.labelsList}>
          <FlatList data={this.state.labels} keyExtractor={(item, index) => item}
                    renderItem={this.renderLabelItem}
                    ItemSeparatorComponent={() => <View style={{borderWidth: 1, borderColor: '#ccc'}} />}  />
        </View>
      </View>
      </Modal>);
  }

  // button style factory: toggle record button style btw active and inactive mode
  renderButton(title, onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.inactiveButtonText;
    return (<TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={style}>{title}</Text>
            </TouchableOpacity>);
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
    /*
    const Banner = firebase.admob.Banner;
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    request.addTestDevice();
    request.addKeyword('baby')
    request.addKeyword('parenting');
    //var advert = firebase.admob().rewarded('ca-app-pub-4412913872988371/6451389174');

    return (<Banner
      unitId={'ca-app-pub-4412913872988371/6451389174'}
      size={'LARGE_BANNER'}
      request={request.build()}
      onAdLoaded={() => {
        console.warn('Advert loaded');
      }}
      onAdFailedToLoad={ (err) => {
        if (err.code === 'admob/error-code-internal-error') {
          console.warn('ad failed to load');
        } else if (err.code === 'admob/error-code-invalid-request') {
          console.warn('invalid request');
        } else if (err.code === 'admob/error-code-network-error') {
          console.warn('network error loading ad');
        } else if (err.code === 'admob/error-code-no-fill') {
          console.warn('ad request successful, but no ad inventory');
        } else if (err.code === 'admob/os-version-too-low') {
          console.warn('os version too low for ads');
        } else console.warn('other ad err', err)
      }}
      onAdOpened={() => {
        console.warn('Advert opened');
      }}
      onAdClosed={() => {
        console.warn('Advert Closed');
      }}
      onAdLeftApplication={() => {
        console.warn('Advert left application');
      }}
    />);
    */
    // return a placeholder image for the banner until review that implementation
    //return <View style={{marginBottom: 30,width: 320, height: 50, backgroundColor: '#fdba31'}} />
    return null;
  }

  // wrapper for the AudioRecorder prepareRecordingAtPath method
  prepareRecordingAtPath(path) {
    AudioRecorder.prepareRecordingAtPath(path, {
      SampleRate: 32000,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac'
    });
  }

  // ensure permission asked on Android during run-time per the platform standards
  checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }
    const rationale = {
      'title': 'Microphone Permission',
      'message': 'ChatterBaby needs to access your microphone to create audio samples.'
    }
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        //console.log('Permission result: ', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  // send file to api for processing
  finishRecording(didSucceed, filePath) {
    // prep fetch API call with formData
    var audioFile = { uri: filePath, type: 'audio/aac', name: 'audioSample.aac' };
    let formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('mode', 'whyCry');
    formData.append('token', '');
    formData.append('data', audioFile);

    // send formData to server
    // https://staging5.ctrl.ucla.edu:7423/app-ws/app/process-data-v2
    // https://chatterbaby.ctrl.ucla.edu/cbaby/test1
    fetch('https://staging5.ctrl.ucla.edu:7423/app-ws/app/process-data-v2', {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
      body: formData
    })
    .then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          if (data.errmsg) {
            Alert.alert('Algorithm error', 'There was an error running the algorithm.');
            console.warn('error', data.errmsg);
          } else {
            this.updateGraph(data);
          }
        })
      }
    })
    .catch((error) => {
      this.setState({showMsgModal: true, errMsg: 'Server error sending the audio file.'});
      firebase.analytics.logEvent('recording_server_error');
      })
  }

  // send label validation to server
  processLabel(label_) {
    // prep fetch API call with formData
    let formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('label', label_);
    formData.append('token', this.state.recordid);

    // send formData to server
    // https://staging5.ctrl.ucla.edu:7423/app-ws/
    fetch('https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-label', {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
      body: formData
    })
    .then((response) => {
      console.log('label response', response);
    })
    .catch((error) => {
      this.setState({showMsgModal: true, errMsg: 'Server error processing the label.'});
      firebase.analytics().logEvent('process_label_server_error');
    })
    firebase.analytics().logEvent('algorithm_validation', { label: label_ });
  }

  // parse response to update state barchart values
  // data: {"result":{"Fussy":0.398,"Hungry":0.316,"Pain":0.286},"record_id":"941","errmsg":""}
  updateGraph(data) {
    this.setState({
      showChart: true,
      painResponse: data.result.Pain*100,
      hungryResponse: data.result.Hungry*100,
      fussyResponse: data.result.Fussy*100,
      recordid: data.record_id
    });
  }

  // update state and AudioRecorder object when recording stops
  async stop() {
      if ( !this.state.recording ) return
      this.setState({ stoppedRecording: true, recording: false, progress: 0, currentTime: 0.0 });
      try {
        const filePath = await AudioRecorder.stopRecording();
        if (Platform.OS === 'android') {
          this.finishRecording(true, filePath);
        }
        return filePath;
      } catch (error) {
        this.setState({showMsgModal: true, errMsg: 'Unable to complete the recording on your device. Please try again.'});
        firebase.analytics().logEvent('recording_stop_error');
      }
  }

  // update state and call AudioRecorder startRecording method when recording begins
  async record() {
    if ( !this.state.hasPermission ) {
      this.setState({showMsgModal: true, errMsg: 'Please enable audio permissions to the app and try again.'});
      firebase.analytics().logEvent('audio_permission_not_enabled');
      return;
    }
    if (this.state.stoppedRecording) {
      this.prepareRecordingAtPath(this.state.audioPath);
    }
    this.setState({ recording: true });
    try {
      const filePath = await AudioRecorder.startRecording();
      firebase.analytics().logEvent('start_recording');
      //firebase.analytics().logEvent('start_recording', { id: _id });
    } catch (error) {
      this.setState({showMsgModal: true, errMsg: 'Please enable audio and storage permissions.'});
      firebase.analytics().logEvent('start_recording_error');
    }
  }

  // will update to processLabel(label) after verifying the correct way to access the label value from props in the new lib
  // give thanks to user for their feedback
  pressLabel(label) {
    //Alert.alert('Thanks', 'Your feedback helps improve the algorithm.');
    this.setState({showOptLabels: false, selectedLabel: true});
    //console.warn('bar chart label', label);
    this.processLabel(label);
  }
}
