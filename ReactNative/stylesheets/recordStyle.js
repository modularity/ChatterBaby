import {StyleSheet} from 'react-native';

module.exports =  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#fff'
  },
  button: {
    padding: 20
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f92222',
    borderRadius: 5,
  },
  disabledButtonText: {
    padding: 20,
    color: '#eee'
  },
  inactiveButtonText: {
    fontSize: 25,
    color: '#2b608a'
  },
  activeButtonText: {
    fontSize: 25,
    color: '#fdba31'
  },
});
