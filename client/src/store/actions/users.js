import * as actionTypes from './actionTypes';
import axios from '../axios-server';
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";

const isDev = (process.env.NODE_ENV === 'development');

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post("/users/register", userData).then(res => 
            history.push("/login")) // re-direct to login on successful register
      .catch(err =>
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        })
      );
  };

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
      .post("/users/login", userData)
      .then(res => {
        // Save to localStorage
  // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err =>
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        })
      );
  };

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: actionTypes.SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
      type: actionTypes.USER_LOADING
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};

// Register User
export const contactUs = (userData) => dispatch => {
  isDev && console.log('[Users] actions  - contactUs')
  return axios.post("/contactUs", userData).then(res => {
            return(res.data)
    }).catch(err =>
        dispatch({
          type: actionTypes.GET_ERRORS,
          payload: err.response.data
        })
      );
};

export const setCurrentUserData = decoded => {
  return {
      type: actionTypes.SET_CURRENT_USERDATA,
      payload: decoded
  };
};

export const getFullUserData = (userEmail) => dispatch => {
  isDev && console.log('[Users] actions  - getFullUserData')
  return axios.post(`/db/getFullUserData?userEmail=${userEmail}`).then(res => {
      dispatch(setCurrentUserData(res.data));
  }).catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    ); 
}

