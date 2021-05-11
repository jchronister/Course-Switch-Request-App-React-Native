import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput } from 'react-native';
import { multiply } from 'react-native-reanimated';


function Login() {
    const [state, setState] = React.useState({ email: '', password: '' });

    const submitHundler = () => {
        if (state.email.endsWith('@miu.edu')) {
            console.log(state.email)
            console.log(state.password)
        } else {
            console.log('errer')
        }
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
                <Text style={{fontSize:20}}>Login Please</Text>
                <Text>
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

export default Login;