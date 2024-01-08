import './App.css';
import React from 'react';
import Direcciones from './components/direcciones';
import Footer from './components/footer';
import NavBar from './components/navbar';
function App() {
  return (
    <React.Fragment >
      <NavBar />
      <div style={{ width: "90%", margin: "0px auto",marginTop: "10px", marginBottom: "100px"}}>
        <Direcciones />
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default App;
