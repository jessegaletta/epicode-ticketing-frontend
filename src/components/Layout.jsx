import { Outlet } from "react-router";
import MyNavBar from "./MyNavBar";

const Layout = function () {
  return (
    <>
      <MyNavBar />
      <Outlet />
    </>
  );
};

export default Layout;
