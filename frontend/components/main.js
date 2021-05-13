import * as React from 'react';
import {  StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ThemeProvider,Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


function Main() {
    const navigation=useNavigation()

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
        <ThemeProvider >
         
               <Button title='List Of Courses' onPress={ListOfCoursesHundler}/>
               <Button title='Latest Switch Reqest Posts' onPress={LatestPosHundler}/>
               <Button title='My Classes & Switch Requests' onPress={CreateNewSwitchRequestHundler}/>
           
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