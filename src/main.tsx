import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { store } from "./store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

/**
 * Точка входа в приложение
 * 
 * Provider оборачивает всё приложение и предоставляет доступ к Redux store
 * для всех компонентов. Это позволяет сохранять состояние фильтра при
 * переключении страниц и при входе в PWA.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

registerSW({
  immediate: true,
  onOfflineReady() {
    console.info("PWA готова к оффлайн-режиму");
  },
});