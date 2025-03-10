import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiList, FiThermometer, FiDroplet, FiCloud, FiEdit3 } from 'react-icons/fi';

const SelectCrop = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [editedCrop, setEditedCrop] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCropsAndSetup = async () => {
            try {
                // Get the saved crop first to prioritize user edits
                const savedCropJSON = localStorage.getItem('selectedCrop');
                let savedCrop = savedCropJSON ? JSON.parse(savedCropJSON) : null;
                
                // Fetch all crops from the database
                const response = await axiosInstance.get('/crops/all');
                
                // Create a map to store user-edited crops by their ID
                let editedCropsMap = {};
                
                // Check if we have any edited crops stored
                const editedCropsJSON = localStorage.getItem('editedCrops');
                if (editedCropsJSON) {
                    editedCropsMap = JSON.parse(editedCropsJSON);
                }
                
                // Apply any edited values to the fetched crops
                const updatedCrops = response.data.map(crop => {
                    if (editedCropsMap[crop.id]) {
                        // Merge the database crop with the user edits
                        return { ...crop, ...editedCropsMap[crop.id] };
                    }
                    return crop;
                });
                
                setCrops(updatedCrops);
                
                // If we have a saved selection, set it as the selected crop
                if (savedCrop) {
                    // Find the crop in the updated list
                    const matchingCrop = updatedCrops.find(crop => crop.id === savedCrop.id);
                    
                    if (matchingCrop) {
                        setSelectedCrop(matchingCrop);
                        setEditedCrop(matchingCrop);
                    } else {
                        // If the crop was not found in the database (rare case), use the saved version
                        setSelectedCrop(savedCrop);
                        setEditedCrop(savedCrop);
                    }
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching crops:", err);
                toast.error('Failed to fetch crop data', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Slide,
                });
                setLoading(false);
            }
        };

        fetchCropsAndSetup();
    }, []);

    const handleCropSelect = (crop) => {
        // Check if there are saved irrigation times for this crop
        const irrigationTimesJSON = localStorage.getItem('irrigationTimes');
        const irrigationTimes = irrigationTimesJSON ? JSON.parse(irrigationTimesJSON) : {};
        
        // Load the saved irrigation times for this crop
        const cropWithTimes = {
            ...crop,
            startTime: irrigationTimes[crop.id]?.startTime || '',
            endTime: irrigationTimes[crop.id]?.endTime || '',
        };
        
        setSelectedCrop(cropWithTimes);
        setEditedCrop(cropWithTimes);
        setIsEditing(false);
        
        // Save the selected crop to localStorage
        localStorage.setItem('selectedCrop', JSON.stringify(cropWithTimes));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedCrop = {
            ...editedCrop,
            [name]: Number(value)
        };
        
        setEditedCrop(updatedCrop);
        
        // Update the selected crop in localStorage
        localStorage.setItem('selectedCrop', JSON.stringify(updatedCrop));
        
        // Also save to edited crops map to ensure persistence
        const editedCropsJSON = localStorage.getItem('editedCrops');
        let editedCrops = editedCropsJSON ? JSON.parse(editedCropsJSON) : {};
        
        // Save only the edited fields for this crop
        editedCrops[updatedCrop.id] = {
            ...editedCrops[updatedCrop.id],
            [name]: Number(value)
        };
        
        localStorage.setItem('editedCrops', JSON.stringify(editedCrops));
        
        // Update the crop in the crops array to ensure consistency
        const updatedCrops = crops.map(c => 
            c.id === updatedCrop.id ? updatedCrop : c
        );
        setCrops(updatedCrops);
    };

    const handleUseThisCrop = () => {
        // Save the selected crop (with any edits) to localStorage for use elsewhere in the app
        localStorage.setItem('selectedCrop', JSON.stringify(editedCrop));
        navigate('/home');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl">Loading crops...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl text-red-400">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
            {/* <FiList className="text-6xl mb-4 text-green-400" /> */}
            <h2 className="text-3xl font-semibold mb-6">Select Crop</h2>

            <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Crop Selection Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 text-green-300">Available Crops</h3>
                        <div className="space-y-2">
                            {crops.map((crop) => (
                                <button
                                    key={crop.id}
                                    onClick={() => handleCropSelect(crop)}
                                    className={`w-full py-3 px-4 text-left rounded-lg transition-colors ${
                                        selectedCrop && selectedCrop.id === crop.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                                    }`}
                                >
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Crop Details Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        {selectedCrop ? (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-semibold text-green-300">{selectedCrop.name}</h3>
                                    <button 
                                        onClick={handleEditToggle}
                                        className="flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                                    >
                                        <FiEdit3 className="mr-1" /> 
                                        {isEditing ? 'View Only' : 'Edit Values'}
                                    </button>
                                </div>
                                
                                {isEditing ? (
                                    /* Editable Form */
                                    <form className="space-y-4">
                                        {/* Temperature */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiThermometer className="mr-2 text-gray-400" />
                                                Temperature Range (°C)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minTemperature"
                                                        value={editedCrop.minTemperature}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxTemperature"
                                                        value={editedCrop.maxTemperature}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Soil Moisture */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiDroplet className="mr-2 text-gray-400" />
                                                Soil Moisture Range (%)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minSoilMoisture"
                                                        value={editedCrop.minSoilMoisture}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxSoilMoisture"
                                                        value={editedCrop.maxSoilMoisture}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Humidity */}
                                        <div>
                                            <div className="flex items-center text-lg font-medium text-gray-300 mb-2">
                                                <FiCloud className="mr-2 text-gray-400" />
                                                Humidity Range (%)
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Minimum</label>
                                                    <input
                                                        type="number"
                                                        name="minHumidity"
                                                        value={editedCrop.minHumidity}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                    <input
                                                        type="number"
                                                        name="maxHumidity"
                                                        value={editedCrop.maxHumidity}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    /* Display-only View */
                                    <div className="space-y-4">
                                        {/* Temperature Range */}
                                        <div className="mb-4">
                                            <div className="flex items-center text-lg font-medium text-gray-300">
                                                <FiThermometer className="mr-2 text-gray-400" />
                                                Temperature Range
                                            </div>
                                            <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-400">Minimum</p>
                                                    <p className="text-xl font-bold">{editedCrop.minTemperature}°C</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Maximum</p>
                                                    <p className="text-xl font-bold">{editedCrop.maxTemperature}°C</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Soil Moisture Range */}
                                        <div className="mb-4">
                                            <div className="flex items-center text-lg font-medium text-gray-300">
                                                <FiDroplet className="mr-2 text-gray-400" />
                                                Soil Moisture Range
                                            </div>
                                            <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-400">Minimum</p>
                                                    <p className="text-xl font-bold">{editedCrop.minSoilMoisture}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Maximum</p>
                                                    <p className="text-xl font-bold">{editedCrop.maxSoilMoisture}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Humidity Range */}
                                        <div className="mb-4">
                                            <div className="flex items-center text-lg font-medium text-gray-300">
                                                <FiCloud className="mr-2 text-gray-400" />
                                                Humidity Range
                                            </div>
                                            <div className="mt-1 p-3 bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-400">Minimum</p>
                                                    <p className="text-xl font-bold">{editedCrop.minHumidity}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Maximum</p>
                                                    <p className="text-xl font-bold">{editedCrop.maxHumidity}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Use This Crop Button */}
                                <button
                                    className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                                    onClick={handleUseThisCrop}
                                >
                                    Use This Crop
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
                                <p className="text-xl mb-2">No Crop Selected</p>
                                <p className="text-center">Please select a crop from the list to view its details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectCrop;