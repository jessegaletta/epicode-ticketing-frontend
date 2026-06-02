import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Main from "./pages/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDetail from "./pages/UserDetail";
import AccessDenied from "./pages/AccessDenied";
import SessionExpired from "./pages/SessionExpired";
import UsersPage from "./pages/UsersPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetail from "./pages/TicketDetail";
import BachelorsPage from "./pages/BachelorsPage";
import BachelorDetail from "./pages/BachelorDetail";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/users/me" element={<UserDetail />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserDetail />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/new" element={<TicketDetail />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/bachelors" element={<BachelorsPage />} />
            <Route path="/bachelors/new" element={<BachelorDetail />} />
            <Route path="/bachelors/:id" element={<BachelorDetail />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/new" element={<CourseDetail />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
