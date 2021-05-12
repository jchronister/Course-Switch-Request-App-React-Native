import * as React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { multiply } from 'react-native-reanimated';
import { Input, ThemeProvider, Text, Button } from 'react-native-elements';
import myContext from './globalState'
import * as ActionType from './action'
import * as Location from 'expo-location';


function Signup({ navigation }) {
    const [state, dispatch] = React.useContext(myContext)
    const [mystate, setState] = React.useState({ name: '', email: '', password: '' });
    const [location, setLocation] = React.useState({ latitude: null, longitude: null });
    const [error, setError] = React.useState(null);

    const submitHundler = () => {


        let latitude = Math.floor(location.latitude)
        let longitude = Math.ceil(location.longitude)


        if (latitude === 41 && longitude === -91) {
            if (mystate.email.endsWith('@miu.edu')) {
                ActionType.signin('api/v1/signup', mystate, dispatch, () => navigation.navigate('main'), setError)
            } else {
                alert('email should matched with @miu.edu')
            }
        } else {
            alert('Student required to be at compus location for Course Switch Request')
        }






    }

    const studentNameHundler = (text) => {
        setState({ ...mystate, name: text })
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
        <ThemeProvider>
            <SafeAreaView >
                <Text h3>Signup Please</Text>
                <Input placeholder='Name' autoFocus={true} style={styles.searchInput} value={mystate.student_Name} onChangeText={(text) => { studentNameHundler(text) }} />
                <Input placeholder='Email' style={styles.searchInput} value={mystate.email} onChangeText={(text) => { emailHundler(text) }} />
                <Input placeholder='Password' style={styles.searchInput} value={mystate.password} onChangeText={(text) => { passwordHundler(text) }} />
                {error && <Text>{error}</Text>}
                <Button  title='Submit' onPress={submitHundler} />
            </SafeAreaView>
        </ThemeProvider>
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
        // borderColor:'pink'
    },
});

export default Signup;