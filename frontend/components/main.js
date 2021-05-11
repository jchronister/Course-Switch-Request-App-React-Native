import * as React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        navigation.navigate('newswetchrequest')
        // console.log('CreateNewSwitchRequest')
    }

    return (
        <View style={styles.container}>
            <Text>
               <Text><Button title='ListOfCourses' onPress={ListOfCoursesHundler}/></Text>
               <Text> <Button title='LatestPos' onPress={LatestPosHundler}/></Text>
               <Text> <Button title='CreateNewSwitchRequest' onPress={CreateNewSwitchRequestHundler}/></Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});

export default Main