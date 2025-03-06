import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiSave, FiLogOut, FiUser, FiKey } from 'react-icons/fi';
import { toast, Bounce, Slide } from 'react-toastify';


const Profile = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            toast.error('User not Found', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                console.log("Fetching data for username:", username); // Log 1
                const response = await axiosInstance.get(`user/${username}`);
                console.log("Response data:", response.data); // Log 2
                setUserData(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error details:", error); // Log 3
                const errorMessage = error.response?.data?.message || 
                                error.response?.data || 
                                error.message || 
                                "An unknown error occurred";
                
                toast.error('Failed to fetch user Data', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [username, navigate]);

    const handleEditToggle = () => {
        setEditing(!editing);
        if (!editing) {
            // Reset form data to current user data when starting to edit
            setFormData(userData);
        }
    };

    const handlePasswordReset = () => {
        navigate('/reset-password');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        // Form validation
        if (!formData.username.trim() || !formData.email.trim()) {
            toast.warn('Username and Email are required', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
    
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.warn('Please Enter a Valid Email Address', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
    
        try {
            const currentUsername = userData.username;
            const response = await axiosInstance.put(`user/update?currentUsername=${currentUsername}`, {
                username: formData.username.trim(),
                email: formData.email.trim(),
            });
            setUserData(response.data);
            setFormData(response.data);
            localStorage.setItem("username", response.data.username);
            toast.success('Profile Updated Successfully', {
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
            setEditing(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data || 
                               error.message || 
                               "An unknown error occurred";
                toast.error('Error Updating Profile}', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };
    
    const handleLogout = () => {
        toast.warn(
            <div>
                <p>Are you sure you want to logout?</p>
                <button
                    onClick={() => confirmLogout()}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss()}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    No
                </button>
            </div>,
            {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            }
        );
    };
    
    const confirmLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
        toast.dismiss(); // Close the toast
    };

    return (

        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-10">
            <FiUser className="text-6xl mb-4" />
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-md text-gray-400 mb-4">{userData.email}</p>
            
            {/* Edit Button */}
            <button
                onClick={handleEditToggle}
                className={`px-3 py-2 rounded-lg text-white font-medium transition ${
                    editing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } mb-4`}
            >
                {editing ? "Cancel" : "Edit Profile"} <FiEdit3 className="inline ml-2" />
            </button>

            {/* Profile Details */}
            <div className="w-full max-w-md">
                {/* Username */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-300">Username</label>
                    {editing ? (
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 text-white"
                        />
                    ) : (
                        <p className="px-4 py-3 bg-gray-800 rounded-lg text-gray-300">{userData.username}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-300">Email</label>
                    {editing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-blue-500 text-white"
                        />
                    ) : (
                        <p className="px-4 py-3 bg-gray-800 rounded-lg text-gray-300">{userData.email}</p>
                    )}
                </div>
                <div className='flex flex-1 justify-center gap-2'>
                {/* Save Changes Button */}
                {editing && (
                    <button
                        onClick={handleSaveChanges}
                        className=" px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium "
                    >
                        Save Changes <FiSave className="inline ml-2" />
                    </button>
                )}
                {/* Password Reset Button */}
                <button
                    onClick={handlePasswordReset}
                    className=" px-4 py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg font-medium mb-"
                >
                    Reset Password <FiKey className="inline ml-2" />
                </button>
                
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className=" px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
                Logout <FiLogOut className="inline ml-2" />
            </button>
                </div>

                
            </div>

        </div>
        
    );
};

export default Profile;
