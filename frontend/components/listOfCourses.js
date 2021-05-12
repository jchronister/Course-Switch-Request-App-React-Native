import * as React from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, TouchableOpacity } from 'react-native';
import { Button, ThemeProvider,Text } from 'react-native-elements';
import myContext from './globalState'
import * as ActionType from './action'
import { useNavigation } from '@react-navigation/core';
import color from 'color';



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
        <ThemeProvider >
            
            <View style={{backgroundColor:'white',flex:1,borderWidth:10,borderRadius:10,borderColor:'black'}}>
            <TouchableOpacity onPress={()=>{sindleCourseHundler(data.offering_id)}}>
            <Text h4 style={{margin:10,padding:5, color:'grey' }}>course_name : {data.course_name}</Text>
            </TouchableOpacity>
            <Text h4 style={{margin:10,padding:10, color:'blue'}}>requests_counter : {data.requests_counter}</Text>
            </View>

        </ThemeProvider>
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