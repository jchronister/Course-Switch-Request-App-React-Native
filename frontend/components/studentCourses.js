// User Current Courses and Switch Requests

import React, {useEffect} from 'react';
import { StyleSheet, Text, ScrollView, FlatList} from 'react-native';
// SafeAreaView, View

import { Button, Card } from 'react-native-elements';


import {callAxios} from "./action";

import jwt from "jwt-decode";
import myContext from './globalState';


export default function StudentOwnCourseView ({navigation, navigation:{navigate}}) {

  const [error, setError] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [{token}] = React.useContext(myContext);


  //Run Data Fetch on Focus
  useEffect( () => {

    //  Return Listener for Unmount
    return navigation.addListener('focus', () => {

          callAxios("get", "/api/v1/courses/student", 
    
          // Format Data
          (data) => {
    
            // Read User Info From Token
            const user = jwt(token);
            
            // Format Data
            setCourses(data.map(n => ({
              block_id: n.block_id,
              begin_date: n.begin_date,
              end_date: n.end_date,
              offering_id: n.course_offerings.offering_id,
              course_id: n.course_offerings.course_id,
              course_name: n.course_offerings.course_name,
              instructor: n.course_offerings.instructor,
              location: n.course_offerings.location,
              notes: n.course_offerings.notes,

              // Get User Switch Request
              switchRequested: n.course_offerings.switch_requests.reduce((a, i) => a || (i.student_id === user.student_id && i), false)
            })));
    
          }
    
        ,
    
        setError
        );
    });
    
  }, [navigation]);

  return (

    <ScrollView>

        {/* Show Error */}
        {error ? <Text style={styles.error}>{error}</Text>
        
        // Or Display Courses
        :
        <FlatList
            data={courses}
            renderItem={n=><CourseInfo {...n} navigate={navigate}/>}
            keyExtractor={n=>n.offering_id}/>
        }

    </ScrollView>

  );

}


function CourseInfo ({navigate, item}) {

  const {block_id, begin_date, course_id, course_name, instructor,
         switchRequested, offering_id, end_date, location} = item;

  return (

    <Card>

      <Card.Title>{block_id + " (" + begin_date.slice(0,10) + " to " + end_date.slice(0,10) + ")"}</Card.Title>
      <Card.Divider/>

        <Text style={styles.class}>{course_id + " " + course_name + " - " + instructor}</Text>
        <Text style={styles.class}>{location}</Text>

        {/* Show Current Requested */}
        {switchRequested && 
            <Text style={styles.class}>{"Current Switch Request for: " +
            switchRequested.desired_course.course_id + " " +
            switchRequested.desired_course.course_name + " " +
            switchRequested.desired_course.instructor + " "
            }</Text>
        }

        <Button
           title={switchRequested ? "Edit Switch Request" : "Create Switch Request"}
           onPress={()=>{
             navigate("UpsertSwitchRequest", {offering_id: offering_id});
           }}
         />
    </Card>

  );




}


const styles = StyleSheet.create({

  container: {
    flex:1,
    margin: 10
  },

  title: {
    fontSize:20,
    padding: 10,
    fontWeight: 'bold'
  },

  class: {
    fontSize:15,
    padding: 10,
  },

  error: {
    color:"red",
    fontSize:20
  }

});