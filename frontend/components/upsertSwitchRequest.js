import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextInput } from 'react-native';

import { CheckBox, Input, Button } from 'react-native-elements';

import {callAxios, Axios} from "./action";

import jwt from 'jsonwebtoken';
import myContext from './globalState';


export default function NewSwetchRequest ({navigation}){

  const [{token}] = React.useContext(myContext);

  const currentCourseId = "6099792f44997eca685ab2ec"

  // Form State
  const [state, setState] = useState({
    currentCourse: "",
    currentCourseInfo: "",
    courseOfferings: [], 
    notes: "", 
    status: null
  });
  
  const [error, setError] = React.useState(null);

    useEffect( () => {

      
      // props.offering_id
      

      // Read User Info From Token
      const {payload: user} = jwt.decode(token, {complete: true});
      
      // Request Data
      callAxios("get", "/api/v1/courses/block/" + currentCourseId,

        // Set State with Returned Data
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
                block_id: data[0].block_id
              };
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
          ).filter(n => n.offering_id !== info.currentCourseInfo.offering_id);

          if (info.currentCourseInfo.offering_id !== currentCourseId) setError("User Not Currently in Selected Course");
          setState({...s, ...info});

        })

          // Data Fetch Error Fx
        , setError

    );}, []);

 

    return (
        <View style={styles.containter}>

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
                  onPress={() => setState(s => ({...s, requestedCourseOfferingId: n.offering_id}))}
                  />
              ))}

            </View>

            <Text style={styles.title}>Notes:</Text>
            <Input
              placeholder='Enter Switch Request Notes'
              value={state.notes}
              onChangeText={(text) => setState((s) => ({...s, notes: text}))}/>

            <Text>Status:</Text>

  {/* Status CheckBoxes */}
  {state.switchRequestId &&
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
  }

  <View style={styles.buttons}>

    {/* Add/Update Button */}
    <View style={styles.button}>
      <Button
        title={state.switchRequestId ? "Update" : "Add"}
        onPress={()=>{ 

          debugger
          Axios.put("/api/v1/courses/switchrequests/" + state.switchRequestId,
          
             {offering_id: state.requestedCourseOfferingId, notes: state.notes, status: state.status, block_id: state.currentCourseInfo.block_id})
          .then((data) => {

            navigation.goBack();
            // setError(JSON.stringify(data))
            
          })
          .catch(err=>setError(err.message));


          
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
            // setError(JSON.stringify(data)
            navigation.goBack()
          },
          setError);
        }}
      />
    </View>}

  </View>

</>}
        </View>
    );



  //   "desired_course": {
  //     "offering_id": "609980c68d2340ba98c45362",
  //     "course_id": "CS401 ",
  //     "course_name": "Modern Programming Practices ",
  //     "instructor": "Anthony Sander "
  // },
  // "notes": "",
  // "status": null,
  // "request_date": "2021-05-09T05:00:00.000Z",
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
    padding: 10
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


