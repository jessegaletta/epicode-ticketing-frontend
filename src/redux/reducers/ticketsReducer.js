import {
  FETCH_TICKETS_LIST_START,
  FETCH_TICKETS_LIST_SUCCESS,
  FETCH_TICKETS_LIST_ERROR,
  FETCH_TICKET_DETAIL_START,
  FETCH_TICKET_DETAIL_SUCCESS,
  FETCH_TICKET_DETAIL_ERROR,
  CLEAR_TICKET_DETAIL,
} from "../actions/tickets";

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

const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TICKETS_LIST_START:
      return {
        ...state,
        list: { ...state.list, loading: true, error: null },
      };
    case FETCH_TICKETS_LIST_SUCCESS:
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
    case FETCH_TICKETS_LIST_ERROR:
      return {
        ...state,
        list: { ...state.list, loading: false, error: action.payload },
      };
    case FETCH_TICKET_DETAIL_START:
      return {
        ...state,
        detail: { ...state.detail, loading: true, error: null },
      };
    case FETCH_TICKET_DETAIL_SUCCESS:
      return {
        ...state,
        detail: { ...state.detail, loading: false, data: action.payload },
      };
    case FETCH_TICKET_DETAIL_ERROR:
      return {
        ...state,
        detail: { ...state.detail, loading: false, error: action.payload },
      };
    case CLEAR_TICKET_DETAIL:
      return {
        ...state,
        detail: { data: null, loading: false, error: null },
      };
    default:
      return state;
  }
};

export default ticketsReducer;
