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
  Dimensions
} from 'react-native';
import axios from 'axios';
// import for icons in form field
import Icon from 'react-native-vector-icons/FontAwesome';
// import StyleSheet
import styles from '../stylesheets/registerStyle';
// import firebase for analytics
import firebase from 'react-native-firebase';
// import CookieManager
import CookieManager from 'react-native-cookies';
// import time utility
import moment from 'moment';
// import cross-platform date picker library
import DatePicker from 'react-native-datepicker';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 'female',
      dob: new Date(),
      email: 'testing@test.com',
      errMsg: '',
      showMsgModal: false,
    }
    /*
    gender: 'female',
    dob: new Date(),
    email: 'testing@test.com',
    errMsg: '',
    showMsgModal: false,
    */
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
            <Icon name="user-o" color="#777" size={15} style={styles.inputImage}/>
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
    /*
    var maleCfg = { color:'#5f97cb', icon:'circle' };
    var femaleCfg = { color: '#5f97cb', icon: 'circle' };
    var noCfg = {};
    var cfg = {male:maleCfg, female:femaleCfg, '':noCfg };
    var {color, icon} = cfg[this.state.gender];
    */

    var boyColor = this.state.gender === 'male' ? '#5f97cb' : '#aaa' ;
    var girlColor = this.state.gender === 'female' ? '#5f97cb' : '#aaa';
    var boyIcon = this.state.gender === 'male' ? 'circle' : 'circle-o';
    var girlIcon = this.state.gender === 'female' ? 'circle' : 'circle-o';

    return (
      <View>
        <Text style={styles.headerText}>
          Baby Gender
        </Text>
        <View style={styles.genderBtns}>
          <Icon.Button name={boyIcon} backgroundColor={boyColor}
                        onPress={() => this.setState({gender: 'male'})}>
             Boy
           </Icon.Button>
           <Icon.Button name={girlIcon} backgroundColor={girlColor}
                          onPress={() => this.setState({gender: 'female'})}>
            Girl
          </Icon.Button>
        </View>
      </View>
    );
  }

  renderCalenderPicker() {
    const _format = 'MM-DD-YYYY';
    const _today = moment().format(_format);
    const _minDate = moment().subtract(720, 'days').format(_format);
    return (
      <View>
        <DatePicker
          androidMode="spinner"
          style={styles.calendar}
          date={this.state.dob}
          mode="date"
          format={_format}
          minDate={_minDate}
          maxDate={_today}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          iconComponent={<Icon name="calendar" size={20} color="#777"/>}
          customStyles={{
            dateInput: {
              //marginLeft: 36,
              backgroundColor: '#fff',
              borderWidth: .5,
              borderColor: 'rgba(0,0,0,0.2)',
              height: 40,
              borderRadius: 10,
            },
            btnTextText: {
              color: '#777',
            },
            btnTextConfirm: {
              color: '#5f97cb',
            },
            btnTextCancel: {
              color: '#777',
            },
            dateText: {
              fontFamily: 'Avenir',
            }
          }}
          onDateChange={(dob) => this.setState({dob})}
        />
        </View>
      );

  /*  return <Picker
      selectedValue={this.state.language}
      style={{ height: 50, width: 100 }}
      onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>




  }


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
        return(
          <TouchableOpacity onPress={() => this.renderAndroidCalendar()}>
            Select Date
          </TouchableOpacity>
        );
    }
    */
  }

  async renderAndroidCalendar() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
          dob: new Date(year, month, day, hour, minute)
        });
      }
    } catch ({code, message}) {
      //console.warn('Cannot open date picker', message);
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
    var data = {
      email: this.state.email,
      mode: 'survey',
      token: '',
      data: registerData
    };

    // need to manually delete cookies before calling API to fix bug with iOS
    CookieManager.clearAll().then((res) => {
    // https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-data-v2

    axios.post('https://chatterbaby.ctrl.ucla.edu/app-ws/app/process-data-v2', data)
      .then((response) => {
        this.logAsRegistered();
      })
      .catch((error) => {
        this.setState({showMsgModal: true, errMsg: 'Unable to reach server. Please try again.'});
        //firebase.analytics().logEvent('register_server_connection_error');
      });
    /*
      // send formData to server
      var formData = new FormData();
      formData.append('email', this.state.email);
      formData.append('mode', 'survey');
      formData.append('token', '');
      formData.append('data', registerData);
      console.warn('submitForm formData', formData);

      fetch('https://164.67.97.127/app-ws/app/process-data-v2', {
        method: 'POST',
        body: formData
      })
      .then((response) => {
        console.log('submitForm resp', response);
        if (response.status === 200) {
          response.json().then((data) => {
            this.logAsRegistered();
          })
        } else {
         console.log('submitForm non 200', response);
          this.setState({showMsgModal: true, errMsg: 'Unable to process registration. Please try again.'});
          //firebase.analytics().logEvent('register_server_error');
        }
      })
      .catch((error) => {
        console.log('submitForm err', error);
        this.setState({showMsgModal: true, errMsg: 'Unable to reach server. Please try again.'});
        //firebase.analytics().logEvent('register_server_connection_error');
      }); */
    });
  }

  // save registered complete and email to device
  async logAsRegistered() {
    try {
      await AsyncStorage.setItem('email', this.state.email);
      firebase.analytics().logEvent('registration_completed');
      this.props.navigation.navigate('TabNav');
    } catch (error) {
      this.setState({showMsgModal: true, errMsg: 'Error with saving registration'});
      firebase.analytics().logEvent('saving_registration_error');
    }
  }
}
