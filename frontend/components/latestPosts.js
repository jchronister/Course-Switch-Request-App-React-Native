/* eslint-disable react/prop-types */
import React, {useMemo} from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, } from 'react-native';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import myContext from './globalState';
import * as ActionType from './action';

import jwt from "jwt-decode";

import * as MailComposer from 'expo-mail-composer';


function LatestPosts({navigation: {navigate}}) {

    const [state, dispatch] = React.useContext(myContext);

    const user = useMemo(() => jwt(state.token), []);

    React.useEffect(() => {
        ActionType.getLatestPost(state.token, dispatch);
    }, []);

    return (
        <ThemeProvider>
            {state.latestPost && <FlatList
                data={state.latestPost}
                renderItem={({ item }) => <IndividualComponent data={item} navigate={navigate} user={user}/>}
                keyExtractor={item => item.course_offerings.switch_requests.request_id}
            />}
        </ThemeProvider>
    );
}

const IndividualComponent = ({ data, navigate, user }) => {

    return (  
        <ThemeProvider>
            <View style={{ backgroundColor: 'white', flex: 1, borderWidth: 10, borderRadius: 10, borderColor: 'black' }}>
                <Text h4 style={styles.info}>{"Posted " + data.course_offerings.switch_requests.request_date.slice(0,10)}</Text>
                <Text h4 style={styles.info}>Student Name:{" " + data.course_offerings.switch_requests.student_name}</Text>
                <Text h4 style={styles.info}>Current Course Name:{" " + data.course_offerings.course_id + " " + data.course_offerings.course_name}</Text>
                <Text h4 style={styles.info}>Desired Course Name:{" " + data.course_offerings.switch_requests.desired_course.course_id + " " + data.course_offerings.switch_requests.desired_course.course_name}</Text>
                <Text h4 style={styles.info}>Notes:{" " + data.course_offerings.notes}</Text>
            

            {user.student_id !== data.course_offerings.switch_requests.student_id ?

                // Email User of Switch Request
                <Button
                  title='Contact via Email' 
                  onPress={()=>{

                    // Open Email
                    MailComposer.composeAsync(
                      {recipients: data.course_offerings.switch_requests.student_email,
                      subject:'Class Switch Request',
                      body:'Hello ' + data.course_offerings.switch_requests.student_name +
                      ' I am interested in switching classes with you ' +
                      data.course_offerings.switch_requests.desired_course.course_id + " " + data.course_offerings.switch_requests.desired_course.course_name +
                      ' with ' +
                      data.course_offerings.course_id + " " + data.course_offerings.course_name
                    });
        
                  }}/>

                // : User Owns Switch Request
                :
                <Button
                  title='Modify Request'
                  onPress={()=>{
                    navigate("UpsertSwitchRequest", {offering_id: data.course_offerings.offering_id});
                  }}/>
                }

            </View>
        </ThemeProvider>
    );
};


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
    },
    info:{ margin: 10, padding: 5, color: 'grey' }
});



export default LatestPosts;