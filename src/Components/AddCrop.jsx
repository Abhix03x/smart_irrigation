import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiList, FiThermometer, FiDroplet, FiCloud, FiEdit3 } from 'react-icons/fi';

const SelectCrop = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCrops, setSelectedCrops] = useState([]); // Array of selected crops
    const [editedCrop, setEditedCrop] = useState(null); // Currently edited crop
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCropsAndSetup = async () => {
            try {
                // Fetch all crops from the database
                const response = await axiosInstance.get('/crops/all');
                setCrops(response.data);

                // Load selected crops from localStorage
                const savedCropsJSON = localStorage.getItem('selectedCrops');
                if (savedCropsJSON) {
                    const savedCrops = JSON.parse(savedCropsJSON);
                    setSelectedCrops(savedCrops);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching crops:", err);
                setError('Failed to fetch crop data');
                setLoading(false);
            }
        };

        fetchCropsAndSetup();
    }, []);

    const handleCropSelect = (crop) => {
        // Check if the crop is already selected
        const isAlreadySelected = selectedCrops.some((c) => c.id === crop.id);

        let updatedCrops;
        if (isAlreadySelected) {
            // Remove the crop if already selected
            updatedCrops = selectedCrops.filter((c) => c.id !== crop.id);
        } else {
            // Add the crop if not already selected
            updatedCrops = [...selectedCrops, crop];
        }

        setSelectedCrops(updatedCrops);
        localStorage.setItem('selectedCrops', JSON.stringify(updatedCrops));
    };

    const handleEditToggle = (crop) => {
        setEditedCrop(crop); // Set the crop to be edited
        setIsEditing(true); // Enable editing mode
    };

    const handleInputChange = (e, cropId) => {
        const { name, value } = e.target;

        // Update the edited crop's values
        const updatedCrop = {
            ...editedCrop,
            [name]: Number(value),
        };

        setEditedCrop(updatedCrop);

        // Update the selected crops array with the edited crop
        const updatedCrops = selectedCrops.map((crop) =>
            crop.id === cropId ? updatedCrop : crop
        );

        setSelectedCrops(updatedCrops);
        localStorage.setItem('selectedCrops', JSON.stringify(updatedCrops));
    };

    const handleSaveEdit = () => {
        setIsEditing(false); // Disable editing mode
        setEditedCrop(null); // Clear the edited crop
    };

    const handleUseTheseCrops = () => {
        navigate('/home');
    };

    if (loading) {
        return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">Loading crops...</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="text-xl text-red-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-6">
            <h2 className="text-3xl font-semibold mb-6">Select Crops</h2>
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
                                        selectedCrops.some((c) => c.id === crop.id)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                                    }`}
                                >
                                    {crop.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Crops Panel */}
                    <div className="bg-gray-700 p-4 rounded-xl">
                        <h3 className="text-xl font-medium mb-4 text-green-300">Selected Crops</h3>
                        {selectedCrops.length > 0 ? (
                            <div className="space-y-2">
                                {selectedCrops.map((crop) => (
                                    <div key={crop.id} className="bg-gray-600 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-semibold">{crop.name}</p>
                                            <button
                                                onClick={() => handleEditToggle(crop)}
                                                className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-400 rounded-lg text-sm"
                                            >
                                                <FiEdit3 className="mr-1" />
                                                Edit
                                            </button>
                                        </div>

                                        {/* Edit Threshold Values (Conditional Rendering) */}
                                        {isEditing && editedCrop?.id === crop.id && (
                                            <div className="mt-4 space-y-4">
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
                                                                onChange={(e) => handleInputChange(e, crop.id)}
                                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                            <input
                                                                type="number"
                                                                name="maxTemperature"
                                                                value={editedCrop.maxTemperature}
                                                                onChange={(e) => handleInputChange(e, crop.id)}
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
                                                                onChange={(e) => handleInputChange(e, crop.id)}
                                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                            <input
                                                                type="number"
                                                                name="maxSoilMoisture"
                                                                value={editedCrop.maxSoilMoisture}
                                                                onChange={(e) => handleInputChange(e, crop.id)}
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
                                                                onChange={(e) => handleInputChange(e, crop.id)}
                                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm text-gray-400 mb-1">Maximum</label>
                                                            <input
                                                                type="number"
                                                                name="maxHumidity"
                                                                value={editedCrop.maxHumidity}
                                                                onChange={(e) => handleInputChange(e, crop.id)}
                                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No crops selected.</p>
                        )}
                    </div>
                </div>

                {/* Use These Crops Button */}
                <button
                    className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                    onClick={handleUseTheseCrops}
                >
                    Use These Crops
                </button>
            </div>
        </div>
    );
};

export default SelectCrop;