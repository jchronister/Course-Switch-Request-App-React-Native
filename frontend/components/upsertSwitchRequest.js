// Add/Modify Switch Request Component

import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { CheckBox, Input, Button } from 'react-native-elements';

import {callAxios} from "./action";

import jwt from "jwt-decode";
import myContext from './globalState';


export default function UpsertSwitchRequest ({navigation, route: {params}}){

  // Get Token for Student_id
  const [{token}] = React.useContext(myContext);
  
  // Form State
  const [state, setState] = useState({
    currentCourse: "",
    currentCourseInfo: "",
    courseOfferings: [], 
    notes: "", 
    status: null
  });
  
  const [error, setError] = React.useState(null);
  const [warning, setWarning] = React.useState(null);

  // Clear Warning
  useEffect( () => setWarning(null), [state]);

  // Retrieve Student Data
  useEffect( () => {

    // Verify Course Id
    if (!(params && params.offering_id)) return setError("Error No Course Offering Id Passed");   

    // Read User Info From Token
    const user = jwt(token, {complete: true});

    // Request Data
    callAxios("get", "/api/v1/courses/block/" + params.offering_id,

      // Set State with Modified Returned Data
      (data) => setState(s => {

        const info = {};
    
        // Get User Current Course
        for (let n of data[0].course_offerings) {
          if (n.students.reduce((a, n) => a || n.student_id === user.student_id, false)) {
            info.currentCourseInfo = {
              offering_id: n.offering_id,
              course_id: n.course_id,
              course_name: n.course_name,
              instructor: n.instructor,
            };
            info.block_id = data[0].block_id;
            break;
          }
        }

        // Get User Current Request Info
        for (let n of data[0].course_offerings) {
          for (let i of n.switch_requests) {
            if (i.student_id === user.student_id) {

              // Update Request State
              info.status = i.status;
              info.requestedCourseOfferingId = i.desired_course.offering_id;
              info.notes = i.notes;
              info.switchRequestId = i.request_id;
              break;
            }
          }
          if (info.switchRequestId) break;
        }
        
        // Get Courses Offered
        info.courseOfferings = data[0].course_offerings.map(
          ({offering_id, course_id, course_name, instructor}) =>
          ({offering_id, course_id, course_name, instructor})
        ).filter(n => !info.currentCourseInfo || n.offering_id !== info.currentCourseInfo.offering_id);

        // Error User Not Scheduled for Course
        if (info.currentCourseInfo && info.currentCourseInfo.offering_id !== params.offering_id) setError("User Not Currently in Selected Course");
        
        // I cause and Error ??? Cannot Modify while updating another component
        // Set Header
        // navigation.setOptions({headerTitle: info.switchRequestId ? "Edit Switch Request" : "Create Switch Request"});

        setState({...s, ...info});
      
      })

        // Data Fetch Error Fx
      , setError

  );}, []);

 
  return (
        
        <ScrollView style={styles.containter}>

            {error ? <Text style={styles.error}>{error}</Text>

            : !state.currentCourseInfo.offering_id ? 

            <Text>...Loading Data</Text>

            :
            <>

            <Text style={styles.title}>Currently Enrolled in Course:</Text>
            <Text style={styles.currentCourse}>{state.currentCourseInfo.course_id + " " + 
                   state.currentCourseInfo.course_name + " - " + 
                   state.currentCourseInfo.instructor}</Text>

            <Text style={styles.title}>Select Course to Switch Into:</Text>
            <View style={styles.coursesAvailable}>

              {state.courseOfferings.map(n => (
                  <CheckBox
                  key={n.offering_id}
                  title={n.course_id + " " + n.course_name + " - " + n.instructor}
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={state.requestedCourseOfferingId === n.offering_id}
                  onPress={() => {
                    setState(s => ({...s, requestedCourseOfferingId: n.offering_id}));
                  }}
                  />
              ))}

            </View>

            <Text style={styles.title}>Notes:</Text>
            <Input
              placeholder='Enter Switch Request Notes'
              value={state.notes}
              onChangeText={(text) => setState((s) => ({...s, notes: text}))}/>

            

            {/* Status CheckBoxes */}
            {state.switchRequestId && <>
              <Text style={styles.title}>Status:</Text>
              <View style={styles.status}>
                  <CheckBox
                    center
                    title='Active'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={state.status === null}
                    onPress={() => setState({...state, status: null})}
                  />
                  <CheckBox
                    center
                    title='Completed'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={state.status === "Completed"}
                    onPress={() => setState({...state, status: "Completed"})}
                  />
              </View>
            </>}


            {warning && <Text style={styles.error}>{warning}</Text>}


            {/* Buttons */}
            <View style={styles.buttons}>

              {/* Add/Update Button */}
              <View style={styles.button}>
                <Button
                  title={state.switchRequestId ? "Update" : "Add"}
                  onPress={()=>{
                    
                    // Update or Add Parameters
                    if (state.switchRequestId) {
                      var method = "put";
                      var url = "/api/v1/courses/switchrequests/" + state.switchRequestId;
                    } else {
                      method = "post";
                      url = "/api/v1/courses/switchrequests";            
                    }

                    // Send Request
                    callAxios(method, url, 

                    // Handle Success
                    (data) => {
                      if (data === 1) {
                        navigation.goBack();
                      } else {
                        setWarning("Data Not Changed");
                      }
                    },

                    // Error Catch Fx
                    err => {
                      if (err === "Missing Data for: offering_id") {
                        setWarning("Please Select Course");
                      } else {
                        setError(err);
                      }
                    },
                    {offering_id: state.requestedCourseOfferingId, notes: state.notes, status: state.status, block_id: state.block_id}
                    );   
                  }}
                  />
              </View>

              {/* Delete Button */}
              {state.switchRequestId && <View style={styles.button}>
                <Button
                  title="Delete"
                  onPress={()=>{ 

                    callAxios("delete", "/api/v1/courses/switchrequests/" + state.switchRequestId, 
                    (data) => {

                      if (data === 1) {
                        navigation.goBack();
                      } else {
                        setError("Internal Error: Switch Request Not Deleted");
                      }
                    },
                    setError);
                  }}/>
              </View>}

          </View>

      </>}
    </ScrollView>
   
  );

}


const styles = StyleSheet.create({

  containter:{
    margin: 5,
    flex: 1
  },

  status: {
    flexDirection: "row",
    flex: 1
  },

  coursesAvailable: {
    flexDirection: "column",
    flex: 1
  },

  title: {
    fontSize:15,
    padding: 10,
    textDecorationLine: 'underline'
  },

  currentCourse: {
    fontSize:20,
    padding: 10
  },

  buttons: {
    flexDirection:"row",
    
    padding: 5
  },
  button: {
    margin:10
  },
  error: {
    color:"red",
    fontSize:20
  }
});


