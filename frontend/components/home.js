import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ThemeProvider,Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Main from './main'
import myContext from './globalState';
import * as ActionType from './action';

function Home({ navigation }) {
    const [state, dispatch] = React.useContext(myContext);

    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('token')
          if(value !== null) {
            dispatch(ActionType.updateToken(value));
            navigation.navigate('main')
          }
        } catch(e) {
          console.log(e)
        }
      }
  


    React.useEffect(()=>{
        getData()
    },[])

    return (
        <ThemeProvider >
            <ThemeProvider >
                <Text h1>Well Come To MIU Course Switch Request Application</Text>
            </ThemeProvider>
            <ThemeProvider>
                {!state.token ? <Mybutt /> : <Main />}
            </ThemeProvider>
        </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    }
});

const Mybutt = () => {
    const navigation = useNavigation()

    const loginHundler = () => {
        navigation.navigate('login')
    }
    const signUpHundler = () => {
        navigation.navigate('signup')
    }
    return (
        <ThemeProvider>
            <Text h4>Please Login/Signup to proceed, Thank you !!</Text>
            <View style={{flex:1,flexDirection:'row'}}>
                <Button margin={10} title='Login' onPress={loginHundler} />
                <Button margin={10} title='Signup' onPress={signUpHundler} />
            </View>
        </ThemeProvider>
    )
}

export default Home;