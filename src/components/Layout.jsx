import { Outlet } from "react-router";
import MyNavBar from "./MyNavBar";
import MyFooter from "./MyFooter";

const Layout = function () {
  return (
    <>
      <MyNavBar />
      <Outlet />
      <MyFooter />
    </>
  );
};

export default Layout;
