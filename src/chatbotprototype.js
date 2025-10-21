import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

/*
  Chatbot Prototype Single-file App
  - Authentication: SignUp / SignIn using localStorage (very simple, for prototype only)
  - Protected Dashboard route
  - Chatbot UI inside Dashboard with message history, quick replies, and basic canned responses
  - Logout button

  How to use:
  1. Replace your src/App.js with this file (or create src/ChatbotPrototype.jsx and import it in index.js)
  2. Ensure you have installed: react-router-dom, react-hot-toast, and Tailwind is configured for styling.
     npm install react-router-dom react-hot-toast
  3. Run your dev server: npm start

  NOTE: This prototype keeps everything client-side for demo purposes only. Do NOT use this for production auth.
*/

/* ---------- Utility: Auth helpers ---------- */
const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const loadUser = () => JSON.parse(localStorage.getItem("user"));
const clearUser = () => localStorage.removeItem("user");

/* ---------- Navbar (with Logout) ---------- */
function Navbar() {
  const navigate = useNavigate();
  const user = loadUser();

  const handleLogout = () => {
    clearUser();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="font-bold text-xl text-blue-600">SmartExpense</div>
        <div className="text-sm text-gray-600">Chatbot Prototype</div>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="text-sm text-gray-700">{user.email}</div>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">Sign In</Link>
            <Link to="/signup" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* ---------- SignUp (re-using user's style) ---------- */
function SignUp() {
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
    saveUser(user);
    toast.success("Account created!");
    navigate("/login");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-blue-50">
      <form onSubmit={handleSignUp} className="bg-white shadow-md rounded-lg px-10 py-8 w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          <span className="text-black">Sign up to </span>
          <span className="text-blue-600">SmartExpense</span>
        </h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md w-full p-2 mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md w-full p-2 mb-3" required />
        <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="border rounded-md w-full p-2 mb-4" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 w-full rounded-md">Create Account</button>
        <p className="text-center text-sm mt-3">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link></p>
      </form>
    </div>
  );
}

/* ---------- SignIn ---------- */
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = loadUser();
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-blue-50">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded-lg px-10 py-8 w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          <span className="text-black">Sign in to </span>
          <span className="text-blue-600">SmartExpense</span>
        </h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-md w-full p-2 mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-md w-full p-2 mb-4" required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 w-full rounded-md">Login</button>
        <p className="text-center text-sm mt-3">Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
      </form>
    </div>
  );
}

/* ---------- Simple Chatbot ---------- */
function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! I'm ExpenseBot. Ask me about your expenses or say 'help'." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const cannedResponses = [
    { pattern: /help|what can you do/i, reply: "I can show examples, suggest categories, or mock a summary of expenses. Try: 'show categories' or 'summary'" },
    { pattern: /categories?/i, reply: "Common categories: Food, Transport, Bills, Entertainment, Shopping, Others." },
    { pattern: /summary/i, reply: "This month: 12 transactions, total ₱23,450." },
    { pattern: /hello|hi/i, reply: "Hello! How can I help with your expenses today?" },
    { pattern: /add expense (\d+(?:\.\d+)?)/i, reply: (m) => `Got it — added expense of ₱${m[1]}.` },
  ];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), from: "user", text };
    setMessages((m) => [...m, newMsg]);
    setInput("");

    // simulate bot thinking
    setTyping(true);
    setTimeout(() => {
      // find canned
      const match = cannedResponses.find((c) => {
        try {
          return c.pattern.test(text);
        } catch (e) {
          return false;
        }
      });
      let botText = "Sorry, I didn't understand. Try 'help' or ask for 'categories'.";
      if (match) {
        botText = typeof match.reply === "function" ? match.reply(text.match(match.pattern)) : match.reply;
      } else if (/\d/.test(text) && /expense/i.test(text)) {
        botText = "Expense noted (mock).";
      }

      const botMsg = { id: Date.now() + 1, from: "bot", text: botText };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 700);
  };

  const quickReplies = ["help", "categories", "summary", "add expense 250"];

  return (
    <div className="max-w-3xl mx-auto h-[70vh] bg-white rounded shadow flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">ExpenseBot</h3>
        <p className="text-sm text-gray-500">A lightweight prototype chatbot (client-only)</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} max-w-[70%] p-3 rounded-lg`}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-2 rounded-lg">Typing...</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 mb-3">
          {quickReplies.map((q) => (
            <button key={q} onClick={() => sendMessage(q)} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm">{q}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 border rounded p-2" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Dashboard (Protected) ---------- */
function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Overview</h3>
            <p className="text-sm text-gray-600">This is a mock overview. Connect real data where needed.</p>
          </div>
        </div>
        <div>
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

/* ---------- Protected Route wrapper ---------- */
function RequireAuth({ children }) {
  const user = loadUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/* ---------- App (Routing) ---------- */
export default function chatbotprototype() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<div className="p-6">Page not found. <Link to="/">Go home</Link></div>} />
        </Routes>
      </div>
    </Router>
  );
}