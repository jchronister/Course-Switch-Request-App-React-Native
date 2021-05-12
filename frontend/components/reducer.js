import * as React from 'react';
import * as ActionType from './action'




export const initialState={showHide:true,token:null,allCourses:[],CourseswichRequestedStudents:[],currentCourse:''}

const Reducer=(state,action)=>{
    if(action.type===ActionType.CHANGE_SHOW_HIDE){
        return {...state,showHide:!state.showHide}
    }
    if(action.type===ActionType.UPDATE_TOKEN){
        return {...state,token:action.payload}
    }
    if(action.type===ActionType.SET_ALL_COURSES){
        return {...state,allCourses:action.payload}
    }
    if(action.type===ActionType.SET_SWETCH_REQUESTED_STUDENTS){
        return {...state,CourseswichRequestedStudents:action.payload}
    }
    if(action.type===ActionType.SET_CURRENT_COURSES){
        return {...state,currentCourse:action.payload}
    }

    return state;
}


export default Reducer;