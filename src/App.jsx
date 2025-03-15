import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Components/Profile";
import Login from "./Pages/Login";
import AddCrop from "./Components/AddCrop";
import CropDetails from "./Components/CropDetails";
// import Dashboard from "./Components/Dashboard";
import Graph from "./Components/Graph";
import ControlPanel from "./Components/ControlPanel";
import Register from "./Pages/Register";
import { useState,useEffect } from "react";
import ResetPasswordRequest from "./Components/ResetPassword";
import ForgotPassword from "./Components/ForgotPassword";
import Notification  from "./Components/Notifications";
import MultiSensorGraph from "./Components/MultiSensorGraph";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ToastContainer, Bounce } from 'react-toastify';
import Navbar from "./Components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    
    <MantineProvider>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordRequest/>}/>
        <Route path="/home" element={<Home onLogout={handleLogout} />}/>
        <Route path="/addCrop"element={<AddCrop />}/>
        <Route path="/cropdetails" element={<CropDetails/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/graph/:sensorType" element={<Graph/>}/>
        <Route path="/control-panel" element={<ControlPanel/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/multi-sensor-graph" element={<MultiSensorGraph/>}/>
      </Routes>
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    </MantineProvider>
  );
}

export default App;
