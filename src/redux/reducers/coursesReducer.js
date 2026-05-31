import {
  FETCH_COURSES_LIST_START,
  FETCH_COURSES_LIST_SUCCESS,
  FETCH_COURSES_LIST_ERROR,
  FETCH_COURSE_DETAIL_START,
  FETCH_COURSE_DETAIL_SUCCESS,
  FETCH_COURSE_DETAIL_ERROR,
  CLEAR_COURSE_DETAIL,
  FETCH_ALL_COURSES_START,
  FETCH_ALL_COURSES_SUCCESS,
  FETCH_ALL_COURSES_ERROR,
} from "../actions/courses";

const initialState = {
  list: {
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 0,
  },
  allList: {
    data: [],
    loading: false,
    error: null,
  },
  detail: {
    data: null,
    loading: false,
    error: null,
  },
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COURSES_LIST_START:
      return {
        ...state,
        list: { ...state.list, loading: true, error: null },
      };
    case FETCH_COURSES_LIST_SUCCESS:
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
    case FETCH_COURSES_LIST_ERROR:
      return {
        ...state,
        list: { ...state.list, loading: false, error: action.payload },
      };
    case FETCH_ALL_COURSES_START:
      return {
        ...state,
        allList: { ...state.allList, loading: true, error: null },
      };
    case FETCH_ALL_COURSES_SUCCESS:
      return {
        ...state,
        allList: { ...state.allList, loading: false, data: action.payload },
      };
    case FETCH_ALL_COURSES_ERROR:
      return {
        ...state,
        allList: { ...state.allList, loading: false, error: action.payload },
      };
    case FETCH_COURSE_DETAIL_START:
      return {
        ...state,
        detail: { ...state.detail, loading: true, error: null },
      };
    case FETCH_COURSE_DETAIL_SUCCESS:
      return {
        ...state,
        detail: { ...state.detail, loading: false, data: action.payload },
      };
    case FETCH_COURSE_DETAIL_ERROR:
      return {
        ...state,
        detail: { ...state.detail, loading: false, error: action.payload },
      };
    case CLEAR_COURSE_DETAIL:
      return {
        ...state,
        detail: { data: null, loading: false, error: null },
      };
    default:
      return state;
  }
};

export default coursesReducer;
