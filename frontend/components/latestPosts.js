import * as React from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, } from 'react-native';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import myContext from './globalState'
import * as ActionType from './action'



function LatestPosts() {
    const [state, dispatch] = React.useContext(myContext);

    React.useEffect(() => {
        // const {data}=route.params
        ActionType.getLatestPost(state.token, dispatch)
    }, []);
    return (
        <SafeAreaView >
            {state.latestPost && <FlatList
                data={state.latestPost}
                renderItem={({ item }) => <IndividualComponent data={item} />}
                keyExtractor={item => item.course_offerings.switch_requests.request_id}
            />}
        </SafeAreaView>
    )
}

const IndividualComponent = ({ data }) => {

    return (
        <ThemeProvider>
            <View style={{ backgroundColor: 'white', flex: 1, borderWidth: 10, borderRadius: 10, borderColor: 'black' }}>
                <Text h4 style={{ margin: 10, padding: 5, color: 'grey' }} > student_name :{data.course_offerings.switch_requests.student_name}</Text>
                <Text h4 style={{ margin: 10, padding: 5, color: 'grey' }}> current_course_name :{data.course_offerings.course_name}</Text>
                <Text h4 style={{ margin: 10, padding: 5, color: 'grey' }}>desired_course_name :{data.course_offerings.switch_requests.desired_course.course_name}</Text>
                <Text h4 style={{ margin: 10, padding: 5, color: 'grey' }}>notes :{data.course_offerings.notes}</Text>
            </View>
            <Button title='Update' />
            <Button title='Delete' />
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



export default LatestPosts;