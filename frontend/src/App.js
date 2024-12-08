import React, { useState } from "react";
import Login from "./componente/Login";
import { Navigation } from "./routes";
import { AuthProvider } from "./context";

function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navigation />
        <header className="App-header">
          <button onClick={handleLoginClick}>
            {isLoginVisible ? "Cerrar Login" : "Ir al login"}
          </button>
          {isLoginVisible && <Login />}
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
