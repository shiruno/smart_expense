import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Account created!");
    navigate("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md rounded-lg px-10 py-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          <span className="text-black">Sign up to </span>
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
          className="border rounded-md w-full p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border rounded-md w-full p-2 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 w-full rounded-md"
        >
          Create Account
        </button>
        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

