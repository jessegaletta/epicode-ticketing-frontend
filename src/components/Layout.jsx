import { Outlet } from "react-router";
import MyNavBar from "./MyNavBar";
import MyFooter from "./MyFooter";

const Layout = function () {
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
