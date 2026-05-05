import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import Login from "./components/Login";
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
