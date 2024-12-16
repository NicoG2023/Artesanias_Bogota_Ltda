import React from "react";
import { Navigation } from "./routes";
import { AuthProvider } from "./context";
import { ToastContainer } from "react-toastify";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;
