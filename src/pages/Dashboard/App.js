import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bot, Wallet, Send, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      navigate("../components/SignIn.jsx");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setIsLoggedIn(false);
    navigate("../components/SignIn.jsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">SmartExpense</h1>
        <div className="space-x-6 hidden md:flex items-center">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#chatbot" className="hover:text-blue-600">Chatbot</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-20">
        <motion.h2 
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Manage Your Finances <span className="text-blue-600">Intelligently</span>
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Track your expenses, get smart budget suggestions, and receive personalized tips 
          through an AI-powered chatbot. Start building better financial habits today.
        </p>
        <motion.a
          href="#features"
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2"
        >
          Get Started <ArrowRight size={18} />
        </motion.a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12 text-gray-900">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<Wallet className="text-blue-600 w-10 h-10 mb-4" />}
              title="Smart Expense Tracking"
              desc="Easily record and categorize your daily expenses using a clean, intuitive interface."
            />
            <FeatureCard
              icon={<BarChart3 className="text-blue-600 w-10 h-10 mb-4" />}
              title="Visual Reports & Insights"
              desc="View detailed charts and graphs to understand your spending habits and progress."
            />
            <FeatureCard
              icon={<Bot className="text-blue-600 w-10 h-10 mb-4" />}
              title="AI Chatbot Assistant"
              desc="Get personalized saving tips, reminders, and budget suggestions through our intelligent chatbot."
            />
          </div>
        </div>
      </section>

      {/* Chatbot Demo Section */}
      <section id="chatbot" className="py-20 bg-blue-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">Chatbot Demo</h3>
          <p className="text-lg text-gray-700 mb-10">
            Meet <strong>SmartBot</strong> — your personal AI assistant that helps you 
            save smarter and spend wiser.
          </p>
          <ChatbotDemo />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">About the Project</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            The <strong>Smart Expense Tracker</strong> is a cloud-based web app built with React and Flask,
            hosted on Microsoft Azure. It helps users manage finances effectively with the help
            of an AI chatbot that provides personalized financial insights.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-10 bg-gray-900 text-white text-center">
        <p className="text-lg font-medium">Ready to take control of your finances?</p>
        <p className="text-gray-400 mt-2">
          © 2025 SmartExpense | Built for better money management
        </p>
      </footer>
    </div>
  );
}

/* --- Feature Card Component --- */
function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-blue-50 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
    >
      {icon}
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

/* --- Chatbot Demo Component --- */
function ChatbotDemo() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’m SmartBot 🤖. How can I help you today?" },
    { sender: "user", text: "Show my spending summary for this week." },
    { sender: "bot", text: "You’ve spent ₱2,450 this week. 60% of it is on food. Want a saving tip?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: "That’s a great question! Here’s what I found..." },
    ]);
    setInput("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-md mx-auto p-4">
      <div className="h-80 overflow-y-auto flex flex-col gap-3 p-2 border border-gray-200 rounded-md mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-left ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
