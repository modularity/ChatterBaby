import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Picker,
  DatePickerAndroid,
  DatePickerIOS,
} from 'react-native';
// import for icons in form field
import Icon from 'react-native-vector-icons/FontAwesome';
// import for web api calls
import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: '',
      dob: new Date(),
      email: ''
    }
  }

  // should validate the data first
  // just sending the form for now
  submitForm() {
    var registerData = { gender: this.state.gender,
                          dob: this.state.dob,
                          email: this.state.email };
    axios({
      url: 'https://chatterbaby.org/app-ws/app/process-data-v2',
      method: 'post',
      data:{mode: 'survey', token: '', data: registerData }
    })
    .then((response) => {
      console.warn('successfully sent registration to server');
      this.props.navigation.navigate('TabNav');
    })
    .catch((error) => {
      console.warn('error sending registration to server', error);
    });
    //.done(() => { });
  }

  async logAsRegistered() {
    try {
      await AsyncStorage.setItem('registered', 'complete');
    } catch (error) {
      // error saving data
    }
    this.props.navigation.navigate('Register');
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
  /* Gender picker
  <Picker
    selectedValue={this.state.gender}
    style={styles.genderPicker}
    onValueChange={(itemValue) => this.setState({gender: itemValue})}>
    <Picker.Item label="Boy" value="male" />
    <Picker.Item label="Girl" value="female" />
  </Picker>
  */


/*
   <Icon.Button name="circle-o" backgroundColor='#aaa' onPress={this.loginWithFacebook}>
    Girl
  </Icon.Button>

  <TouchableOpacity style={styles.skipBtn} onPress={() => this.setState({gender: 'male'})}>
  <Text style={styles.skipText}>
    Boy
  </Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.skipBtn} onPress={() => this.setState({gender: 'female'})}>
  <Text style={styles.skipText}>
    Girl
  </Text>
  </TouchableOpacity>
*/


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
            <TouchableOpacity style={styles.skipBtn} onPress={() => console.warn('skip')}>
            <Text style={styles.skipText}>
              Skip
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={() => this.submitForm()}>
            <Text style={styles.submitText}>
              Submit
            </Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  headerText: {
    textAlign: 'left',
    color: '#5f97cb',
    fontSize: 24
  },
  genderPicker: {
    margin: 0,
    padding: 0,
  },
  genderBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 10,
  },
  input: {
    height: 40,
    width: Dimensions.get('window').width*.7,
    borderColor: 'gray',
    borderWidth: 1
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#5f97cb',
    padding: 10,
    //borderRadius: 5,
  },
  submitText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  skipBtn: {
    backgroundColor: '#aaa',
    padding: 10,
    //borderRadius: 5,
  },
  skipText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  }
});
