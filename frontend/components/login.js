import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Button, TextInput } from 'react-native';
import { multiply } from 'react-native-reanimated';
import * as ActionType from './action'
import myContext from './globalState'
import * as Location from 'expo-location';


// Hamid 41.017005
//  Hamid C

function Login({ navigation }) {
    const myRef = React.useRef()
    const [state, dispatch] = React.useContext(myContext)
    const [mystate, setState] = React.useState({ email: '', password: '' });
    const [location, setLocation] = React.useState({ latitude: null, longitude: null });

    const submitHundler = () => {

        let latitude = Math.floor(location.latitude)
        let longitude = Math.ceil(location.longitude)

        if (latitude === 41 && longitude === -91) {
            if (mystate.email.endsWith('@miu.edu')) {
                ActionType.updatetoken(mystate, dispatch)
                navigation.navigate('main');
            } else {
                alert('email should matched with @miu.edu')
            }
        } else {
            alert('Student required to be at compus location for Course Switch Request')
        }

    }

    const emailHundler = (text) => {
        setState({ ...mystate, email: text })
    }
    const passwordHundler = (text) => {
        setState({ ...mystate, password: text })
    }


    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let currentlocation = await location.coords
            console.log(currentlocation)
            let { latitude, longitude } = await currentlocation;
            setLocation((prev) => {
                return { ...prev, latitude: latitude, longitude: longitude }
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20 }}></Text>
            <SafeAreaView >
                <Text style={{ fontSize: 20 }}>Login Please</Text>

                <TextInput  style={styles.searchInput} autoFocus={true} placeholder="Email" value={state.email} onChangeText={(text) => { emailHundler(text) }} />
                <TextInput style={styles.searchInput}  placeholder="Password"  value={state.password} onChangeText={(text) => { passwordHundler(text) }} />

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
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 3,
        // height: 30,
        // margin: 12,
        // borderWidth: 1,
    },
});

export default Login;