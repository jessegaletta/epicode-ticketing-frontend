import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyNavBar from "./MyNavBar";
import MyFooter from "./MyFooter";
import { fetchProfileAction } from "../../redux/actions";

const Layout = function () {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const darkMode = useSelector(state => state.settings.darkMode);

  /* if the page is refreshed the token is still in localStorage but user is null;
     the profile is fetched again to restore the logged-in state */
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfileAction(token));
    }
  }, [token, user, dispatch]);

  /* Bootstrap 5 dark mode is activated by setting data-bs-theme on the <html> element;
     placed here on the root layout so it applies to the entire page */
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="d-flex flex-column vh-100">
      <MyNavBar />
      <main className="flex-grow-1 d-flex flex-column overflow-x-hidden overflow-y-auto w-100">
        <Outlet />
      </main>
      <MyFooter />
    </div>
  );
};

export default Layout;
