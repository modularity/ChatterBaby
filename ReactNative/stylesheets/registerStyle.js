import {StyleSheet, Dimensions} from 'react-native';
var width = Dimensions.get('window').width;
module.exports =  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    justifyContent: 'space-around',
    alignItems: 'stretch',
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
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 40,
    borderRadius: 10,
    margin: 8
  },
  inputImage: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    //resizeMode : 'stretch',
    alignItems: 'center'
  },
  input: {
    height: 40,
    width: width*.6,
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
  modalMsgContainer: {
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
   flex: .3,
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
 confirmBtn: {
   backgroundColor: '#b3d1f2',
   borderRadius: 15,
   padding: 10,
 },
});
