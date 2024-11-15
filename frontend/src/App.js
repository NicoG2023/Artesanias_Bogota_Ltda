import React, { useState } from 'react';
import './App.css';
import Login from './componente/Login';

function App() {
  
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleLoginClick = () =>{
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleLoginClick}>
          {isLoginVisible ? 'Cerrar Login': 'Ir al login'}
        </button>
        {isLoginVisible && <Login/>}
      </header>
    </div>
  );
}

export default App;
