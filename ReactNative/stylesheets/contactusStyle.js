import {StyleSheet} from 'react-native';

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
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 3,
    color: '#34495e',
  },
  pageText: {
    fontFamily: 'Avenir',
    color: '#34495e',
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold'
  }
});
