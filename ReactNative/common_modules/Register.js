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
      email: ''
    }
    firebase.analytics().setCurrentScreen('register');
  }

  skipForm() {
    //console.warn('skip');
    this.props.navigation.navigate('TabNav');
  }
  // should validate the data first
  // just sending the form for now
  submitForm() {
    var registerData = { gender: this.state.gender, dob: this.state.dob, email: this.state.email };

    // send formData to server
    var formData = new FormData();
    formData.append('mode', 'survey');
    formData.append('token', '');
    formData.append('data', registerData);
    fetch('https://chatterbaby.org/app-ws/app/process-data-v2', {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'},
      body: formData
    })
    .then((response) => {
      //console.log('register API response', response);
      response.json().then((data) => {
        //console.warn('successfully sent registration to server', data);
        this.logAsRegistered();
      })
    })
    .catch((error) => {
      //console.log('error sending registration to server', error);
      Alert.alert('Server error', 'Unable to send registration. Please try again.');
    })
  }

  async logAsRegistered() {
    try {
      await AsyncStorage.setItem('registered', 'complete');
      //console.log('just completed registration');
    } catch (error) {
      //console.log('error with saving registration');
    }
    this.props.navigation.navigate('TabNav');
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
    if (Platform.ios) {
      return (
        <View>
          <DatePickerIOS
                date={this.state.dob}
                mode="date"
                onDateChange={(dob) => this.setState({dob})} />
           <Text style={styles.headerText}>
             Email
           </Text>
           <TextInput
             style={styles.input}
             onChangeText={(email) => this.setState({email})}
             value={this.state.email}
           />
         </View>
      )
    } else {
      /*
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

  render() {
    var boyIcon = this.state.gender === 'male' ? 'circle' : 'circle-o';
    var girlIcon = this.state.gender === 'female' ? 'circle' : 'circle-o';
    return (
        <View style={styles.container}>
        <View style={styles.formContainer}>
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
          <Text style={styles.headerText}>
            Baby DOB
          </Text>
          <View>
            <DatePickerIOS
                  date={this.state.dob}
                  mode="date"
                  onDateChange={(dob) => this.setState({dob})} />
             <Text style={styles.headerText}>
               Email
             </Text>
             <TextInput
               style={styles.input}
               onChangeText={(email) => this.setState({email})}
               value={this.state.email}
             />
           </View>
        </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.skipBtn}
                onPress={() => this.skipForm()}>
            <Text style={styles.skipText}>
              Skip
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn}
                onPress={() => this.submitForm()}>
            <Text style={styles.submitText}>
              Submit
            </Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}
