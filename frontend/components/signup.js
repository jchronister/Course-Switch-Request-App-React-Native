import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput } from 'react-native';
import { multiply } from 'react-native-reanimated';


function Signup() {
    const [state, setState] = React.useState({ student_Name: '', email: '', password: '' });

    const submitHundler = () => {
        if (state.email.endsWith('@miu.edu')) {
            console.log(state.student_Name)
            console.log(state.email)
            console.log(state.password)
        } else {
            console.log('errer')
        }
    }

    const studentNameHundler = (text) => {
        setState({ ...state, student_Name: text })
    }

    const emailHundler = (text) => {
        setState({ ...state, email: text })
    }

    const passwordHundler = (text) => {
        setState({ ...state, password: text })
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20 }}></Text>
            <SafeAreaView >
            <Text style={{fontSize:20}}>Signup Please</Text>
                <Text>
                    <Text>Student_Name: <TextInput style={styles.searchInput} value={state.student_Name} onChangeText={(text) => { studentNameHundler(text) }} /></Text>
                    <Text>Email: <TextInput style={styles.searchInput} value={state.email} onChangeText={(text) => { emailHundler(text) }} /></Text>
                    <Text>Password: <TextInput style={styles.searchInput} value={state.password} onChangeText={(text) => { passwordHundler(text) }} /></Text>
                </Text>
                <Text><Button title='Submit' onPress={submitHundler} /></Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    searchInput: {
        height: 30,
        margin: 12,
        borderWidth: 1,
    },
});

export default Signup;