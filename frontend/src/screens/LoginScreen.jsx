import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useMutation } from "react-query";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation(
    ({ email, password }) => login(email, password),
    {
      onSuccess: (data) => {
        dispatch(setCredentials(data));
        toast.success("Logged in successfully!");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              required
              autoComplete="true"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className={`w-full py-2 px-4 mt-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Sign In
        </button>
        {mutation.error && (
          <p className="text-red-500 mt-2">
            {mutation.error.response?.data?.message || "Login failed"}
          </p>
        )}
      </form>

      <div className="py-4 text-center">
        <p>
          New Customer?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
