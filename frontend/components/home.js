import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Main from './main'

function Home() {
    const [state, setState] = React.useState(true);

    return (
        <View style={styles.container}>
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>Well Come To MIU Course Switch Request Application</Text>
            </View>
            <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                {state ?<Mybutt/> : <Main />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});

const Mybutt = () => {
    const navigation=useNavigation()

    const loginHundler = () => {
        navigation.navigate('login')
    }
    const signUpHundler = () => {
        navigation.navigate('signup')
    }
    return (
        <>
            <View >
                <Text style={{ fontSize: 20 }}>Please Login/Signup to proceed, Thank you !!</Text>
            </View>
            <Text>
                <Text><Button title='Login' onPress={loginHundler} /></Text>
                <Text> <Button title='Signup' onPress={signUpHundler} /></Text>
            </Text>
        </>
    )
}

export default Home;