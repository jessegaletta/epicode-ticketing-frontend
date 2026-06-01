import {
  FETCH_USERS_LIST_START,
  FETCH_USERS_LIST_SUCCESS,
  FETCH_USERS_LIST_ERROR,
  FETCH_USER_DETAIL_START,
  FETCH_USER_DETAIL_SUCCESS,
  FETCH_USER_DETAIL_ERROR,
} from "../actions";

const initialState = {
  list: {
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 0,
    params: {},
  },
  detail: {
    data: null,
    loading: false,
    error: null,
  },
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_LIST_START:
      return {
        ...state,
        list: { ...state.list, loading: true, error: null, params: action.params || state.list.params },
      };
    case FETCH_USERS_LIST_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          data: action.payload.content,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
        },
      };
    case FETCH_USERS_LIST_ERROR:
      return {
        ...state,
        list: { ...state.list, loading: false, error: action.payload },
      };
    case FETCH_USER_DETAIL_START:
      return {
        ...state,
        detail: { ...state.detail, loading: true, error: null },
      };
    case FETCH_USER_DETAIL_SUCCESS:
      return {
        ...state,
        detail: { ...state.detail, loading: false, data: action.payload },
      };
    case FETCH_USER_DETAIL_ERROR:
      return {
        ...state,
        detail: { ...state.detail, loading: false, error: action.payload },
      };
    default:
      return state;
  }
};

export default usersReducer;
