import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg px-10 py-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          <span className="text-black">Sign in to </span>
          <span className="text-blue-600">SmartExpense</span>
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md w-full p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-md w-full p-2 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 w-full rounded-md"
        >
          Login
        </button>
        <p className="text-center text-sm mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}


