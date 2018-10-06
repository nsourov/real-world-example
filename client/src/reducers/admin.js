import {
  GET_ALL_USER,
  GET_USER,
  SET_PERMISSION,
  GET_ROLE,
  DELETE_ROLE,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_USER:
      return {
        ...state,
        users: action.payload.users,
      };
    case GET_USER:
      return {
        ...state,
        users: [action.payload.user],
      };
    case GET_ROLE:
      return {
        ...state,
        roles: action.payload.roles,
      };
    case SET_PERMISSION:
      return {
        ...state,
        roles: action.payload.roles,
      };
    default:
      return state;
  }
};
