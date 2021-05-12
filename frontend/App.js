import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/main'
import Home from './components/home'
import Login from './components/login'
import Signup from './components/signup'
import ListOfCourses from './components/listOfCourses'
import LatestPosts from './components/latestPosts'
import NewSwetchRequest from './components/newSwetchRequest'
import myContext from './components/globalState'
import Reducer from './components/reducer'
import { initialState } from './components/reducer'
import SwitchRequestedStudents from './components/switchRequuestedStudents'

const Stack = createStackNavigator();


export default function App() {
  return (
    <myContext.Provider value={React.useReducer(Reducer,initialState)}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='home' component={Home} options={{
            title: 'Home'
          }} />
          <Stack.Screen name='main' component={Main} options={{
            title: 'Main'
          }} />
          <Stack.Screen name='login' component={Login} options={{
            title: 'Login'
          }} />
          <Stack.Screen name='signup' component={Signup} options={{
            title: 'Signup'
          }} />
          <Stack.Screen name='listofcourses' component={ListOfCourses} options={{
            title: 'List_Of_Courses'
          }} />
          <Stack.Screen name='latestposts' component={LatestPosts} options={{
            title: 'Latest_Posts'
          }} />
          <Stack.Screen name='newswetchrequest' component={NewSwetchRequest} options={{
            title: 'New_Swetch_Request'
          }} />
          <Stack.Screen name='switchrequestedstudents' component={SwitchRequestedStudents} options={{
            title: 'Switch_Requested_Students'
          }} />
        </Stack.Navigator>
      </NavigationContainer>

    </myContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
