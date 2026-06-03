import {
  FETCH_ACTIVITIES_START,
  FETCH_ACTIVITIES_SUCCESS,
  FETCH_ACTIVITIES_ERROR,
  CREATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_SUCCESS,
  DELETE_ACTIVITY_SUCCESS,
  CLEAR_ACTIVITIES,
} from "../actions/activities";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const activitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACTIVITIES_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ACTIVITIES_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_ACTIVITIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_ACTIVITY_SUCCESS:
      return {
        ...state,
        data: [action.payload, ...state.data], // add to top since ordered desc
      };
    case UPDATE_ACTIVITY_SUCCESS:
      return {
        ...state,
        // map() is used to replace only the updated activity without mutating the original array
        data: state.data.map((activity) =>
          activity.id === action.payload.id ? action.payload : activity
        ),
      };
    case DELETE_ACTIVITY_SUCCESS:
      return {
        ...state,
        // filter() is used to remove the deleted activity without mutating the original array
        data: state.data.filter((activity) => activity.id !== action.payload),
      };
    case CLEAR_ACTIVITIES:
      return initialState;
    default:
      return state;
  }
};

export default activitiesReducer;
