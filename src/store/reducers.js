import {combineReducers} from 'redux';

function userStateReducer(state = 0, action){
    switch (action.type) {
        case 'LOGIN':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: true
            }
        }
        case 'LOGOUT':{
            return {
                ...state,
                jwt: action.payload.jwt,
                userId: action.payload.userId,
                isAuthenticated: false
            }
        }
        default:
            return state
    }   
}

export const rootReducer = combineReducers({
    userData: userStateReducer
})

export const setUserData = (userData) => ({type: 'LOGIN', payload: {
    jwt: userData.token,
    userId: userData.userId,
    isAuthenticated: true
}})

export const deleteUserData = () => ({type: 'LOGOUT', payload: {
    jwt: '',
    userId: '',
    isAuthenticated: false
}})