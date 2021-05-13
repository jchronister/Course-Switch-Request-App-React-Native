import * as React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const IP="10.10.14.216"

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('token', value)
    } catch (e) {
      console.log(e);
    }
  }
  


// Axios Config
export const Axios = axios.create({
    baseURL: "http://192.168.1.10:8000",
  // baseURL: "http://localhost:8000",
  headers: {post: {"Content-Type": "application/json"}}
  }
);



export const CHANGE_SHOW_HIDE='CHANGE_SHOW_HIDE'
export const UPDATE_TOKEN ='UPDATE_TOKEN'
export const SET_ALL_COURSES ='SET_ALL_COURSES'
export const SET_SWETCH_REQUESTED_STUDENTS ='SET_SWETCH_REQUESTED_STUDENTS'
export const SET_LATEST_POST ='SET_LATEST_POST'
export const RESEST_STATE='RESEST_STATE'



//function that change showHide property of global state the showhide 
export const changeShowHide=()=>{
    return {
        type:CHANGE_SHOW_HIDE
    }
}


export const updateToken=(v)=>{
    Axios.defaults.headers.common['Authorization'] = v;
    return {
        type:UPDATE_TOKEN ,
        payload:v
    }
}
export const resetState=(fx)=>{
    fx()
    return {
        type:RESEST_STATE 
    }
}


//function that update token property of global state  
export const signin=(url, obj, dispatch, fx, errFx) => {

    Axios.post(url,obj)

    .then ( resp => {

        if(resp.data.status==='Success'){

            // Set Axios Token
            // Axios.defaults.headers.common['Authorization'] = resp.data.data;

            // Update User Info State
            dispatch(updateToken(resp.data.data))
            
            storeData(resp.data.data)

            // Go to Main Page
            fx();

        } else {
            throw resp.data.error;
        }
    })
    
      // Error Handler Fx
      .catch(err => errFx(err.message || err));
};

const setAllCourses=(v)=>{
    return {
        type:SET_ALL_COURSES ,
        payload:v
    }
}


//function that update allcourses property of global state  
export const getallCourses=(token,dispatch)=>{
    let url='/api/v1/courses'
    Axios.get(url,{headers:{'Authorization':token}})
    .then(resp=>{
        if(resp.data.status==='Success'){
            dispatch( setAllCourses(resp.data.data))
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}


const setSwetchRequest=(v)=>{
    return {
        type:SET_SWETCH_REQUESTED_STUDENTS ,
        payload:v
    }
}

//function that update CourseswichRequestedStudents property of global state  
export const getswetchRequestedStudents=(token,dispatch,data)=>{
    let url=`/api/v1/courses/${data}`
    Axios.get(url,{headers:{'Authorization':token}})
    .then(resp=>{
        if(resp.data.status==='Success'){
            dispatch( setSwetchRequest(resp.data.data[0].course_offerings[0].switch_requests))
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}

const setlatestPoste=(v)=>{
    return {
        type:SET_LATEST_POST ,
        payload:v
    }
}

export const getLatestPost=(token,dispatch)=>{
    let url=`/api/v1/courses/switchrequests`
    Axios.get(url,{headers:{'Authorization':token}})
    .then(resp=>{
        if(resp.data.status==='Success'){
            dispatch( setlatestPoste(resp.data.data.filter(n=>n.course_offerings.switch_requests.status===null)));
            // console.log(resp.data.data)
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}



// /**
// *   Axios Request Proxy to Apply Callback Functions & Handle Errors
// *   @param {Promise} axiosReq - axios Request Returned Promise
// *   @param {function} thenFx - n Functions to Apply as then
// *   @param {function} errFx - Error Function
// */
// export function axiosRequest (axiosReq, thenFx, errFx) {
// debugger
//   // Server Request - Pass Good Data and Throw All Errors
//   const request = axiosReq.then(data => {

// // debugger
//     // Return Object Data
//     if (data.data && data.data.status === "Success") return data.data

//     // Throw Non Server Response Object Error
//     throw (data.data)
//   })

//   // Apply Callback Functions
//   (Array.isArray(thenFx)?thenFx:[thenFx]).reduce((a, n) => a.then(n), request)

//   // Handle Errors
//   .catch(err => {

// // debugger

//     if (err.response && err.response.data && err.response.data.error) {

//       // Show Server Response Error 
//       errFx("Server Message\n" + Object.entries(err.response.data).join("\n"))
    
//     } else if (err.response  ) {

//       // Show Axios Reponse Error
//       errFx(err.response)

//     } else {

//       // Other Error
//       errFx("Request Error" + err.message)
//       // alert("Request Error.\n" + JSON.stringify(err, null, 2) + "\nSee Console for Details")

//     } 

//   })

//   // Catch All Misc Errors
//   .catch((err)=>errFx("Unknown Error - Programming Logic Error: " + err))

// }


export function callAxios(method, url, fx, errFx, options) {

  Axios[method](url, options)

  .then ( resp => {
// debugger
      if(resp.data.status==='Success'){

          // Execute Callback
          fx(resp.data.data || resp.data.nModified);

      } else {
          throw resp.data.error;
      }
  })
  
    // Error Handler Fx
    .catch(err => errFx(err.message || err))
}
