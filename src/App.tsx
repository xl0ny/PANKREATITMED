import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Toolbar from "./components//Toolbar/Toolbar";
import Home from "./pages/Home/Home";
import Criteria from "./pages/Criteria/Criteria";
import Criterion from "./pages/Criterion/Criterion";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import PankreatitOrders from "./pages/PankreatitOrders/PankreatitOrders";
import PankreatitOrder from "./pages/PankreatitOrder/PankreatitOrder";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { fetchUserAsync, selectToken } from "./store/slices/authSlice";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Загружаем информацию о пользователе при монтировании, если есть токен
  useEffect(() => {
    if (token) {
      dispatch(fetchUserAsync() as any).catch((error: unknown) => {
        console.warn("Ошибка загрузки пользователя:", error);
      });
    }
  }, [dispatch, token]);

  console.log(import.meta.env);
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pankreatitorders"
              element={
                <ProtectedRoute>
                  <PankreatitOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pankreatitorders/:id"
              element={
                <ProtectedRoute>
                  <PankreatitOrder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;