import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { multiply } from 'react-native-reanimated';
import { Button, ThemeProvider,Text,Input } from 'react-native-elements';
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

    const [error, setError] = React.useState(null);

    const submitHundler = () => {
      // debugger
        // let latitude = Math.floor(location.latitude)
        // let longitude = Math.ceil(location.longitude)
        let latitude = location.latitude;
        let longitude = location.longitude;
       
    // MIU Boundary's
    const testing = false;

    if (testing ||

      // Between South & North Boundary
      ( latitude >= 41.0147347 && latitude <= 41.0321724) 
	      && 
	    // Between West & East
      ( longitude >= -91.9709155 && longitude <= -91.9582494)
      
      ) {

        // if (latitude === 41 && longitude === -91) {

          ActionType.signin('/api/v1/login', mystate, dispatch, () => navigation.navigate('main'), setError)

        } else {
            alert('Student required to be at compus location for Course Switch Request')
        }

    }

    const emailHundler = (text) => {
        setState({ ...mystate, email: text })
        setError(null)
    }
    const passwordHundler = (text) => {
        setState({ ...mystate, password: text })
        setError(null)
    }


    React.useEffect(() => {
        (async () => {
          try{
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
          } catch (e) {setError(e)}
        })();
    }, []);

    return (
        <ThemeProvider>
            <ScrollView>
                <Text h3>Login Please</Text>

                <Input  style={styles.searchInput} autoFocus={true} placeholder="Email" value={state.email} onChangeText={(text) => { emailHundler(text) }} />
                <Input style={styles.searchInput}  placeholder="Password"  value={state.password} onChangeText={(text) => { passwordHundler(text) }} />

                {error && <Text>{error}</Text>}
                <Button title='Submit' onPress={submitHundler} />
            </ScrollView>
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
    },
});

export default Login;