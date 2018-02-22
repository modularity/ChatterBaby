import {StyleSheet, Dimensions} from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
module.exports =  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  scrollView: {
    paddingBottom: 25,
  },
  title: {
    padding: 30,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 3,
    color: '#34495e',
  },
});
