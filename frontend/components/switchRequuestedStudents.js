import * as React from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import myContext from './globalState'
import * as ActionType from './action'



function SwitchRequestedStudents({ navigation, route }) {
    const [state, dispatch] = React.useContext(myContext);

    React.useEffect(() => {
        const { data } = route.params
        ActionType.getswetchRequestedStudents(state.token, dispatch, data)
    }, []);
    return (
        <SafeAreaView >
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
        <ThemeProvider>
            <View style={{ backgroundColor: 'white', flex: 1, borderWidth: 10, borderRadius: 10, borderColor: 'black' }}>
                <Text h4 style={{ margin: 10, padding: 10, color: 'blue' }}>student_name : {data.student_name}</Text>
                <Text h4 style={{ margin: 10, padding: 10, color: 'grey' }}> desired_course_id : {data.desired_course.course_id}</Text>
                <Text h4 style={{ margin: 10, padding: 10, color: 'purple' }}>desired_course_name : {data.desired_course.course_name}</Text>

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



export default SwitchRequestedStudents;