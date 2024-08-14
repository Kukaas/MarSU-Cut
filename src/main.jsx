import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ThemeProvider } from "./components/components/ThemProvider.jsx";
import { store, persistor } from "./redux/store.js";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <App />

        </Provider>
      </PersistGate>
    </ThemeProvider>
  </React.StrictMode>
);
