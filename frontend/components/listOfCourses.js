import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import myContext from './globalState'
import * as ActionType from './action'
import { useNavigation } from '@react-navigation/core';



function ListOfCourses() {
    const [state, dispatch] = React.useContext(myContext);

    React.useEffect(() => {
        ActionType.getallCourses(state.token, dispatch)
    }, []);
    return (
        <SafeAreaView >
            {state.allCourses && <FlatList
                data={state.allCourses}
                renderItem={({ item }) => <IndividualComponent data={item} />}
                keyExtractor={item => item.offering_id}
            />}
        </SafeAreaView>

    )
}

const IndividualComponent = ({ data }) => {
    const  navigation= useNavigation() 
    const sindleCourseHundler=(data)=>{
        navigation.navigate('switchrequestedstudents',{data})
        console.log(data)
    }
    return (
        <View >
            <TouchableOpacity onPress={()=>{sindleCourseHundler(data.offering_id)}}>
            <Text style={styles.text}>{data.course_name}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>requests_counter : {data.requests_counter}</Text>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        margin: 10,
        padding: 10,
        fontSize: 20
    }
});



export default ListOfCourses;