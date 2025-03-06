import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast, Slide } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
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
      return;
    }

    try {
        const response = await axiosInstance.post('/auth/register', {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password
        });
        toast.success('User Registration Successfull', {
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
        toast.error('Registration Failed try again', {
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
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Name:
            <input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" type="text" id="name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" required />
          </label>
          <label className="block text-sm font-medium text-gray-300">
            Email:
            <input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
          </label>
          <label className="block text-sm font-medium text-gray-300">
            Username:
            <input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" type="text" id="username" name="username" value={formData.username} onChange={handleChange} autoComplete="username" required />
          </label>
          <label className="block text-sm font-medium text-gray-300">
            Password:
            <input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />
          </label>
          <label className="block text-sm font-medium text-gray-300">
            Confirm Password:
            <input className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" required />
          </label>
          <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" type="submit">Register</button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-400">Already registered? <a className="text-green-400 hover:underline" href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default Register;
