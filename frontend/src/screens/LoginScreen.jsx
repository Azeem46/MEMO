import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/autApi';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { mutate: login, isLoading, error } = useLoginMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData, {
            onSuccess: () => {
                toast.success('Logged in successfully!');
                navigate('/');
            },
            onError: () => {
                toast.error('Login failed. Please try again.');
            }
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

           <form onSubmit={handleSubmit}>
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
            Email Address
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                autoComplete="true"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
        </label>
    </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
            Password
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                autoComplete="true"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
        </label>
    </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 mt-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    Sign In
                </button>
                {error && <p>{error.response.data.message}</p>}
            </form>

            <div className="py-4 text-center">
                <p>
                    New Customer? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
