import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiKey } from 'react-icons/fi';
import { toast, Slide, Bounce } from 'react-toastify';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email: formData.email });
            setMessage(response.data);
            setStep(2);
        } catch (error) {
            toast.error('Error requesting OTP', {
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

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
            setMessage(response.data);
            setStep(3);
        } catch (error) {
            toast.error('Invaid OTP', {
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            toast.success('Password Updated Successfully', {
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
            navigate('/login');
        } catch (error) {
            toast.success('Error resetting password', {
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-10">
            <FiLock className="text-6xl mb-4 text-blue-400" />
            <h2 className="text-3xl font-semibold mb-6">Reset Password</h2>

            <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg">
                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Email Address</label>
                            <div className="relative mt-1">
                                <FiMail className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        >
                            Request OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">Enter OTP</label>
                            <div className="relative mt-1">
                                <FiKey className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-300">New Password</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute left-3 top-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                {message && (
                    <div
                        className={`mt-6 text-center text-sm ${
                            message.includes('Error') ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
