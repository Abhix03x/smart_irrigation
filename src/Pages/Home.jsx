import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChartBarIcon, PlusCircleIcon, CogIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { WaterDropIcon, ThermometerIcon, LeafIcon } from "./CustomIcons";
import { toast, Slide } from "react-toastify";

const Home = () => {
  const [selectedCrop, setSelectedCrop] = useState([]);
  const [sensorData, setSensorData] = useState({
    Temperature: "N/A",
    Humidity: "N/A",
    SoilMoisture: "N/A",
  });
  const navigate = useNavigate();

  // Fetch user crops directly using useEffect
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch("/api/user/crops");
        if (response.ok) {
          const crops = await response.json();
          setUserCrops(crops);
        } else {
          console.error("Error fetching crops:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    fetchCrops();
  }, []);

  // WebSocket setup for real-time data
  useEffect(() => {
    let socket;
    let intervalId;

    const openSocket = () => {
        socket = new WebSocket("wss://demo-spring-1.onrender.com:443/ws/sensor-data");

        socket.onopen = () => {
            console.log("WebSocket connected!");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Received sensor data:", data);
                setSensorData((prevData) => ({
                    ...prevData,
                    Temperature: data.Temperature || prevData.Temperature,
                    Humidity: data.Humidity || prevData.Humidity,
                    SoilMoisture: data.SoilMoisture || prevData.SoilMoisture,
                }));
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        console.error("Websocket not Connected");
        
        socket.onclose = (event) => {
            console.log("WebSocket closed:", event);
        };
    };

    const closeSocket = () => {
        if (socket) {
            socket.close();
            console.log("WebSocket closed");
        }
    };

    const requestData = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send("Request data"); // Send a request for new data
            console.log("Requesting sensor data...");
        }
    };

    // Start opening and closing the socket every 5 seconds
    const manageSocket = () => {
        openSocket();
        setTimeout(requestData, 1000); // Request data after connection has time to establish

        intervalId = setInterval(() => {
            closeSocket(); // Close the existing connection before opening a new one
            openSocket();  // Open a new connection
            setTimeout(requestData, 1000); // Request data after connection has time to establish
        }, 5000); // 5000ms = 5 seconds
    };

    // Start socket management when the component mounts
    manageSocket();

    // Cleanup on component unmount
    return () => {
        clearInterval(intervalId); // Clear interval
        closeSocket(); // Close socket when component unmounts
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    // Load selected crops from localStorage
    const savedCropsJSON = localStorage.getItem('selectedCrops');
    if (savedCropsJSON) {
        const savedCrops = JSON.parse(savedCropsJSON);
        setSelectedCrop(savedCrops);
    }
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 pt-20 pb-6 px-6 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-bold text-teal-400">Smart Irrigation Dashboard</h1>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="bg-gray-700 text-teal-400 px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
          >
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </motion.button> */}
        </motion.div>
  
        {/* Sensor Data */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
        >
          {Object.entries(sensorData).map(([key, value]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/graph/${key}`)}
              className="relative group bg-gray-800 shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-teal-400">{key}</h3>
                {/* Icon placeholders */}
              </div>
              <div className="text-4xl font-bold text-gray-300">{value}{key === "Temperature" ? "°C" : key === "Humidity" ? "%" : "%"}</div>
              <div className="relative">
                {/* <button className="text-blue-600 text-right hover:text-blue-200"
                onClick={() => navigate(`/graph/${key}`)}
                >
                    Graph
                </button> */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-800 text-teal-400 text-sm py-2 px-4 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 Click to View Graph Page
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
  
        {/* User Crops */}
        {selectedCrop.length > 0 && (
          <div className="bg-gray-700 p-5 rounded-lg mb-5">
            <h3 className="text-xl font-semibold text-green-300">Selected Crops</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedCrop.map((crop) => (
                <div key={crop.id} className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-300">{crop.name}</h4>
                  <div className="mt-2">
                      <p className="text-gray-400 font-bold">Temperature: {crop.minTemperature}°C - {crop.maxTemperature}°C</p>
                      <p className="text-gray-400 font-bold">Humidity: {crop.minHumidity}% - {crop.maxHumidity}%</p>
                      <p className="text-gray-400 font-bold">Soil Moisture: {crop.minSoilMoisture}% - {crop.maxSoilMoisture}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Buttons */}
        {/* <div className="flex flex-wrap justify-center gap-6 mt-6">
          <button
            onClick={() => navigate("/multi-sensor-graph")}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-500 transition-all"
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>View Sensor Graph</span>
          </button>
          <button
            onClick={() => navigate("/addCrop")}
            className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-teal-500 transition-all"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>{selectedCrop ? "Change Crop" : "Add Crop"}</span>
          </button>
        </div> */}

        {/* Control Panel Button */}
        {/* <button
          onClick={() => navigate("/control-panel")}
          className="flex items-center space-x-2 bg-gray-700 text-teal-400 px-6 py-3 rounded-full shadow-md hover:bg-gray-600 transition-all fixed bottom-8 right-8"
        >
          <CogIcon className="w-5 h-5" />
          <span>Control Panel</span>
        </button> */}
      </motion.div>
    </div>
  );
};

export default Home;