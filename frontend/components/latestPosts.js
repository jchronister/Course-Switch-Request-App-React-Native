import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import myContext from './globalState'
import * as ActionType from './action'



function LatestPosts() {
    const [state, dispatch] = React.useContext(myContext);

    React.useEffect(() => {
        // const {data}=route.params
        ActionType.getLatestPost(state.token, dispatch)
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            {state.latestPost && <FlatList
                data={state.latestPost}
                renderItem={({ item }) => <IndividualComponent data={item} />}
                keyExtractor={item => item.course_offerings.offering_id}
            />}
        </SafeAreaView>
    )
}

const IndividualComponent = ({ data }) => {
    
    return (
        <View >
             <Text style={styles.text}>{data.course_offerings.switch_requests.student_name}</Text>
            <Text style={styles.text}>{data.course_offerings.course_name}</Text>
            <Text style={styles.text}>{data.course_offerings.switch_requests.desired_course.course_name}</Text>
            <Text style={styles.text}>{data.course_offerings.notes}</Text>
            <Text>
                <Button title='Update'/>
                <Button title='Delete'/>
            </Text>

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



export default LatestPosts;