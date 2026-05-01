import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
// import { Provider } from "react-redux";

function App() {
  return (
    // <Provider>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
    // </Provider>
  );
}

export default App;
