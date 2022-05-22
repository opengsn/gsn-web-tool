import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./routes/App";
import store from "./redux/store";
import { Provider } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
);

