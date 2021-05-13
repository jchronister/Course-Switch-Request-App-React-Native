import * as React from 'react';
import {  StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ThemeProvider,Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ActionType from './action';
import myContext from './globalState';


function Main({navigation}) {
    const [state, dispatch] = React.useContext(myContext);
    // const navigation=useNavigation()

   const removeValue = async () => {
        try {
            console.log("Am here");
           AsyncStorage.removeItem('token');
          dispatch(ActionType.resetState(()=>{ navigation.navigate('home')}))
        console.log('Done.')
        console.log(state.token);

        } catch(e) {
          console.log(e);
        }
      
        // console.log('Done.')
      }

    const ListOfCoursesHundler=()=>{
        navigation.navigate('listofcourses')
        // console.log('ListOfCourses' )
    }
    const LatestPosHundler=()=>{
        navigation.navigate('latestposts')
        // console.log('LatestPos' )
    }
    const CreateNewSwitchRequestHundler=()=>{
        navigation.navigate('studentCourses')
        // console.log('CreateNewSwitchRequest')
    }

    return (
        <View style={styles.container}>
         
         <View style={styles.buttonView}><Button buttonStyle={styles.buttons} title='List Of Courses with Switch Request Count' onPress={ListOfCoursesHundler}/></View>
         <View style={styles.buttonView}><Button buttonStyle={styles.buttons} title='Latest Switch Request Posts' onPress={LatestPosHundler}/></View>
         <View style={styles.buttonView}><Button buttonStyle={styles.buttons} title='My Classes & Switch Request' onPress={CreateNewSwitchRequestHundler}/></View>
         <View style={styles.buttonView}><Button buttonStyle={styles.buttons} title='Logout' onPress={removeValue}/></View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    buttonView:{
      margin: 20,
      flex: 1
    },
    buttons:{
      padding: 35,
    
    }
});

export default Main;