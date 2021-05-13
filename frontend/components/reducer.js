import * as React from 'react';
import * as ActionType from './action'




export const initialState={showHide:true,token:null,allCourses:[],CourseswichRequestedStudents:[],latestPost:[]}

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
    if(action.type===ActionType.SET_LATEST_POST){
        return {...state,latestPost:action.payload}
    }
    if(action.type===ActionType.RESEST_STATE){
        return {...state,showHide:true,token:null,allCourses:[],CourseswichRequestedStudents:[],latestPost:[]}
    }

    return state;
}


export default Reducer;