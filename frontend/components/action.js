import * as React from 'react';
import axios from 'axios'


export const CHANGE_SHOW_HIDE='CHANGE_SHOW_HIDE'
export const UPDATE_TOKEN ='UPDATE_TOKEN'
export const SET_ALL_COURSES ='SET_ALL_COURSES'
export const SET_SWETCH_REQUESTED_STUDENTS ='SET_SWETCH_REQUESTED_STUDENTS'
export const SET_CURRENT_COURSES ='SET_CURRENT_COURSES'



//function that change showHide property of global state the showhide 
export const changeShowHide=()=>{
    return {
        type:CHANGE_SHOW_HIDE
    }
}


const updateToken=(v)=>{
    return {
        type:UPDATE_TOKEN ,
        payload:v
    }
}

//function that update token property of global state  
export const updatetoken=(obj,dispatch)=>{
    let url='http://localhost:8000/api/v1/login'
    axios.post(url,obj)
    .then(resp=>{
        if(resp.data.status==='Success'){
           dispatch( updateToken(resp.data.data))
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}


//function that update token property of global state  
export const createAccount=(obj,dispatch)=>{
    let url='http://localhost:8000/api/v1/signup'
    axios.post(url,obj)
    .then(resp=>{
        if(resp.data.status==='Success'){
            dispatch( updateToken(resp.data.data))
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}

const setAllCourses=(v)=>{
    return {
        type:SET_ALL_COURSES ,
        payload:v
    }
}


//function that update allcourses property of global state  
export const getallCourses=(token,dispatch)=>{
    let url='http://localhost:8000/api/v1/courses'
    axios.get(url,{headers:{'Authorization':token}})
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
    let url=`http://localhost:8000/api/v1/courses/${data}`
    axios.get(url,{headers:{'Authorization':token}})
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

const setCurrentCurse=(v)=>{
    return {
        type:SET_CURRENT_COURSES ,
        payload:v
    }
}

export const getLatestPost=(token,dispatch)=>{
    let url=`http://localhost:8000/api/v1/courses`
    axios.get(url,{headers:{'Authorization':token}})
    .then(resp=>{
        if(resp.data.status==='Success'){
            dispatch( setSwetchRequest(resp.data.data[0].course_offerings[0].switch_requests))
            dispatch(setCurrentCurse(resp.data.data[0].course_offerings[0].course_name))
            console.log(resp.data)
        }else{
            alert(resp.data.status)
        }
    }).catch(err=>{
        console.log(err)
    })
}
