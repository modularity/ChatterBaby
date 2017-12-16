import {StyleSheet, Dimensions} from 'react-native';

module.exports =  StyleSheet.create({
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
