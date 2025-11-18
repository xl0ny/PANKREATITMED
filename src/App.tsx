import { Routes, Route } from "react-router-dom";
import Toolbar from "./components//Toolbar/Toolbar";
import Home from "./pages/Home/Home";
import Criteria from "./pages/Criteria/Criteria";
import Criterion from "./pages/Criterion/Criterion";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import "./App.css";

const App = () => {
  console.log(import.meta.env)
  return (
    <>
    <div className="app-layout">
        <Toolbar /> {/* Панель будет на всех страницах */}
        <Breadcrumbs />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/criteria" element={<Criteria />} />
            <Route path="/criteria/:id" element={<Criterion />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;