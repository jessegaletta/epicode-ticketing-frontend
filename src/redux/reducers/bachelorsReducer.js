import {
  FETCH_BACHELORS_LIST_START,
  FETCH_BACHELORS_LIST_SUCCESS,
  FETCH_BACHELORS_LIST_ERROR,
  FETCH_BACHELOR_DETAIL_START,
  FETCH_BACHELOR_DETAIL_SUCCESS,
  FETCH_BACHELOR_DETAIL_ERROR,
  CLEAR_BACHELOR_DETAIL,
} from "../actions/bachelors";

const initialState = {
  list: {
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 0,
  },
  detail: {
    data: null,
    loading: false,
    error: null,
  },
};

const bachelorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BACHELORS_LIST_START:
      return {
        ...state,
        list: { ...state.list, loading: true, error: null },
      };
    case FETCH_BACHELORS_LIST_SUCCESS:
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
    case FETCH_BACHELORS_LIST_ERROR:
      return {
        ...state,
        list: { ...state.list, loading: false, error: action.payload },
      };
    case FETCH_BACHELOR_DETAIL_START:
      return {
        ...state,
        detail: { ...state.detail, loading: true, error: null },
      };
    case FETCH_BACHELOR_DETAIL_SUCCESS:
      return {
        ...state,
        detail: { ...state.detail, loading: false, data: action.payload },
      };
    case FETCH_BACHELOR_DETAIL_ERROR:
      return {
        ...state,
        detail: { ...state.detail, loading: false, error: action.payload },
      };
    case CLEAR_BACHELOR_DETAIL:
      return {
        ...state,
        detail: { data: null, loading: false, error: null },
      };
    default:
      return state;
  }
};

export default bachelorsReducer;
