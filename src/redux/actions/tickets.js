import { logoutAction } from "./auth";

export const FETCH_TICKETS_LIST_START = "FETCH_TICKETS_LIST_START";
export const FETCH_TICKETS_LIST_SUCCESS = "FETCH_TICKETS_LIST_SUCCESS";
export const FETCH_TICKETS_LIST_ERROR = "FETCH_TICKETS_LIST_ERROR";

export const FETCH_TICKET_DETAIL_START = "FETCH_TICKET_DETAIL_START";
export const FETCH_TICKET_DETAIL_SUCCESS = "FETCH_TICKET_DETAIL_SUCCESS";
export const FETCH_TICKET_DETAIL_ERROR = "FETCH_TICKET_DETAIL_ERROR";
export const CLEAR_TICKET_DETAIL = "CLEAR_TICKET_DETAIL";

export const clearTicketDetailAction = () => ({
  type: CLEAR_TICKET_DETAIL,
});

export const fetchTicketsListAction = (params = {}) => {
  const { page = 0, search = "", sortBy = "createdAt", sortDir = "DESC", category = "", status = "", onlyOpen = false } = params;
  return async (dispatch) => {
    dispatch({ type: FETCH_TICKETS_LIST_START, params });
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:3001/tickets?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      if (onlyOpen) {
        url += `&onlyOpen=${encodeURIComponent(onlyOpen)}`;
      }

      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_TICKETS_LIST_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch tickets");
      }
    } catch (error) {
      dispatch({
        type: FETCH_TICKETS_LIST_ERROR,
        payload: error.message,
      });
    }
  };
};

export const fetchTicketDetailAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TICKET_DETAIL_START });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/tickets/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: FETCH_TICKET_DETAIL_SUCCESS,
          payload: data,
        });
      } else {
        if (response.status === 401) {
          dispatch(logoutAction(null, true));
        }
        throw new Error(response.status === 403 ? "Access Denied" : "Failed to fetch ticket details");
      }
    } catch (error) {
      dispatch({
        type: FETCH_TICKET_DETAIL_ERROR,
        payload: error.message,
      });
    }
  };
};

export const saveTicketAction = (id, ticketData, isEditing, navigate) => {
  return async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `http://localhost:3001/tickets/${id}` : `http://localhost:3001/tickets`;
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(ticketData)
      });
      
      if (response.ok || response.status === 201) {
        navigate("/tickets");
      } else {
        const err = await response.json();
        throw new Error(err.message || "Error during save");
      }
    } catch (e) {
      throw new Error(e.message || "Network error or server unreachable");
    }
  }
};

export const deleteTicketAction = (id) => {
  return async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3001/tickets/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    if (!response.ok) {
      let errMessage = "Error during deletion";
      try {
        const err = await response.json();
        errMessage = err.message || errMessage;
      } catch (e) {}
      throw new Error(errMessage);
    }
  };
};

export const changeTicketStatusAction = (id, statusData) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/tickets/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(statusData)
      });
      
      if (response.ok) {
        dispatch(fetchTicketDetailAction(id));
      } else {
        const err = await response.json();
        throw new Error(err.message || "Error changing status");
      }
    } catch (e) {
      throw new Error(e.message || "Network error or server unreachable");
    }
  }
};
