import {StyleSheet, Dimensions} from 'react-native';

module.exports =  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  webView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*.8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
  },
  cancelText: {
    color: 'white',
    fontSize: 20,
  },
  consentBtn: {
    backgroundColor: '#5f97cb',
    padding: 10
  },
  consentText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
