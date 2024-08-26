import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { signup } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {isLoading, error } = useMutation();

  const mutation = useMutation(({ name, email, password }) => signup(name, email, password), {
    onSuccess: () => {
      toast.success('Registered successfully!');
      // Redirect to login page after successful signup
      navigate('/login');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, email, password });
  };

  return (
     <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name here"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             placeholder="Email"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             placeholder="Password"
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          </label>
        </div>
        <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                >
                    {isLoading ? 'Signing up...' : 'Signup'}
                </button>
                {error && <p>{error.response.data.message}</p>}
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </div>
            </form>

    </div>
  );
}
