import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
  DatePickerAndroid,
  DatePickerIOS,
  Modal,
} from 'react-native';
// import for icons in form field
import Icon from 'react-native-vector-icons/FontAwesome';
// import StyleSheet
import styles from '../stylesheets/registerStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: '',
      dob: new Date(),
      email: '',
      errMsg: '',
      showMsgModal: false,
    }
    firebase.analytics().setCurrentScreen('register');
  }

  render() {
    return (
      <View style={styles.container}>
      {this.renderMessage()}
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>
            Email
          </Text>
          <View style={styles.inputSection}>
            <Icon name="user-o" color="#777" style={styles.inputImage}/>
            <TextInput
                style={styles.input}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                autoCapitalize='none'
                keyboardType='email-address'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                />
          </View>

        {this.renderBabyGender()}
          <Text style={styles.headerText}>
            Baby DOB
          </Text>
          {this.renderCalenderPicker()}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.submitBtn} onPress={() => this.validateForm()}>
            <Text style={styles.submitText}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBabyGender() {
    var boyIcon = this.state.gender === 'male' ? 'circle' : 'circle-o';
    var girlIcon = this.state.gender === 'female' ? 'circle' : 'circle-o';
    return (
      <View>
        <Text style={styles.headerText}>
          Baby Gender
        </Text>
        <View style={styles.genderBtns}>
          <Icon.Button name={boyIcon} backgroundColor='#aaa'
                        onPress={() => this.setState({gender: 'male'})}>
             Boy
           </Icon.Button>
           <Icon.Button name={girlIcon} backgroundColor='#aaa'
                          onPress={() => this.setState({gender: 'female'})}>
            Girl
          </Icon.Button>
        </View>
      </View>
    );
  }

  /*
  consider adding cross-platform date picker from react-native-calendars library

  <Calendar
    // Initially visible month. Default = Date()
    current={'2012-03-01'}

    // Handler which gets executed on day press. Default = undefined
    onDayPress={(day) => {console.log('selected day', day)}}

    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat={'yyyy MM'}

    // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange={(month) => {console.log('month changed', month)}}

  />

  */

  renderCalenderPicker() {
    if (Platform.OS === 'ios') {
      return (
        <View>
          <DatePickerIOS
                date={this.state.dob}
                mode="date"
                onDateChange={(dob) => this.setState({dob})} />
         </View>
      )
    } else {
      return null;
      /* // hasnt been tested on android
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          date: new Date()
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          // Selected year, month (0-11), day
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
      */
    }
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

  // ensure gender and email selected
  validateForm() {
    var msg = '';
    if (!this.state.gender) msg+='please enter gender \n';
    if (!this.state.email) msg += 'please enter your email';
    else if (!this.validateEmail()) msg += 'please enter a valid email';
    if (msg) this.setState({showMsgModal: true, errMsg:msg});
    else this.submitForm();
  }

  validateEmail() {
    var re = /\S+@\S+\.\S+/;
    var isValid = re.test(this.state.email);
    return isValid;
  }

  // valid forms will get sent to server
  submitForm() {
    var registerData = { gender: this.state.gender, dob: this.state.dob, email: this.state.email };

    // send formData to server
    var formData = new FormData();
    formData.append('email', this.state.email);
    formData.append('mode', 'survey');
    formData.append('token', '');
    formData.append('data', registerData);
    fetch('https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-data-v2', {
      method: 'post',
      body: formData
    })
    .then((response) => {
      console.warn(response);
      if (response.status === 200) {
        response.json().then((data) => {
          console.warn('successfully sent registration to server', data);
          //this.logAsRegistered();
        })
      } else {
        this.setState({showMsgModal: true, errMsg: 'Unable to process registration. Please try again.'});
        //firebase.analytics.logEvent('register_server_error');
      }
    })
    .catch((error) => {
      //console.log('error sending registration to server', error);
      this.setState({showMsgModal: true, errMsg: 'Unable to reach server. Please try again.'});
      //firebase.analytics.logEvent('register_server_connection_error');
    })
  }

  // iPhone X launch image: 1125px × 2436px

  // save registered complete and email to device
  async logAsRegistered() {
    var values = [ ['registered', 'yes'],['email',this.state.email] ];
    AsyncStorage.multiSet(values, (err, result) => {
      if (err) {
        this.setState({showMsgModal: true, errMsg: 'Error with saving registration'});
        //firebase.analytics.logEvent('saving_registration_error');
      } else {
        this.props.navigation.navigate('TabNav');
      }
    });
  }
}
