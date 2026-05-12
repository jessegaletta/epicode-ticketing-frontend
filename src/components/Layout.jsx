import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyNavBar from "./MyNavBar";
import MyFooter from "./MyFooter";
import { fetchProfileAction } from "../redux/actions";

const Layout = function () {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const darkMode = useSelector(state => state.settings.darkMode);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfileAction(token));
    }
  }, [token, user, dispatch]);

  // Apply Dark Mode Theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="d-flex flex-column vh-100">
      <MyNavBar />
      <main className="flex-grow-1 d-flex overflow-auto">
        <Outlet />
      </main>
      <MyFooter />
    </div>
  );
};

export default Layout;
