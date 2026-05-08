import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyNavBar from "./MyNavBar";
import MyFooter from "./MyFooter";
import { fetchProfileAction } from "../redux/actions";

const Layout = function () {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfileAction(token));
    }
  }, [token, user, dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <MyNavBar />
      <main className="flex-grow-1 d-flex">
        <Outlet />
      </main>
      <MyFooter />
    </div>
  );
};

export default Layout;
