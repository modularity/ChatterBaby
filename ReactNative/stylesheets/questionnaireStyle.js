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
  webView: {
    width: width,
    height: height*.9,
  },
  modalMsgContainer: {
   marginTop: 20,
   flex: .6,
   justifyContent:'center',
   alignItems: 'center',
   alignSelf: 'center',
 },
 modalClose: {
   width: width*.8,
   backgroundColor: '#f1592a',
   padding: 5,
 },
 modalHeader: {
   flex: .6,
   width: width*.8,
   backgroundColor: '#f1592a',
   justifyContent: 'center',
   alignItems: 'center',
 },
 infoRadius: {
   borderWidth:2,
   borderColor:'#ecf0f1',
   alignItems:'center',
   justifyContent:'center',
   width:100,
   height:100,
   backgroundColor:'#fff',
   borderRadius:100,
 },
 modalTxtContainer: {
   width: width*.8,
   backgroundColor: '#ecf0f1',
   flex: .5,
   justifyContent: 'center',
   alignItems: 'center',
 },
  h1Text: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    margin: 3,
    color: '#34495e',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#34495e',
  },
  pageText: {
    fontFamily: 'Avenir',
    color: '#34495e',
    fontWeight: 'normal',
  },
  boldText: {
    fontFamily: 'Avenir',
    color: '#34495e',
    fontWeight: 'bold',
    margin: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#5f97cb',
    padding: 10,
    borderRadius: 5,
  },
  submitText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
