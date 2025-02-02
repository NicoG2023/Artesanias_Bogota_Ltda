import React from "react";
import { Navigation } from "./routes";
import { AuthProvider } from "./context";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";
import "semantic-ui-css/semantic.min.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <PrimeReactProvider>
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
    </PrimeReactProvider>
  );
}

export default App;
