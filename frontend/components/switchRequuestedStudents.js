import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import myContext from './globalState'
import * as ActionType from './action'



function SwitchRequestedStudents({ navigation,route }) {
    const [state, dispatch] = React.useContext(myContext);

    React.useEffect(() => {
        const {data}=route.params
        ActionType.getswetchRequestedStudents(state.token, dispatch,data)
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            {state.CourseswichRequestedStudents && <FlatList
                data={state.CourseswichRequestedStudents}
                renderItem={({ item }) => <IndividualComponent data={item} />}
                keyExtractor={item => item.request_id}
            />}
        </SafeAreaView>
    )
}

const IndividualComponent = ({ data }) => {
    
    return (
        <View >
            <Text style={styles.text}>{data.student_name}</Text>
            <Text style={styles.text}>{data.desired_course.course_id}</Text>
            <Text style={styles.text}>{data.desired_course.course_name}</Text>

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



export default SwitchRequestedStudents;