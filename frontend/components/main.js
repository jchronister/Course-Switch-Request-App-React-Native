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
        navigation.navigate('newswetchrequest')
        // console.log('CreateNewSwitchRequest')
    }

    return (
        <ThemeProvider >
         
               <Button title='ListOfCourses' onPress={ListOfCoursesHundler}/>
               <Button title='LatestPos' onPress={LatestPosHundler}/>
               <Button title='CreateNewSwitchRequest' onPress={CreateNewSwitchRequestHundler}/>
               <Button title='Logout' onPress={removeValue}/>
           
        </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});

export default Main