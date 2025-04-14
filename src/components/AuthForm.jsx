import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  // Remove default body margin/padding when this component mounts
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in both fields.");
      return;
    }

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? "Logged in!" : "Signup successful! Please check your email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-10 to-white relative overflow-hidden flex items-center justify-center">
      {/* File Icons Background */}
      <div className="absolute inset-0 z-0 opacity-10 select-none pointer-events-none animate-pulse">
        <div className="flex flex-wrap justify-around items-center h-full">
          <img src="https://img.icons8.com/color/512/pdf-2.png" alt="pdf" className="w-20 h-20" />
          <img src="https://img.icons8.com/color/512/ms-word.png" alt="word" className="w-20 h-20" />
          <img src="https://img.icons8.com/color/512/ms-excel.png" alt="excel" className="w-20 h-20" />
          <img src="https://img.icons8.com/color/512/ms-powerpoint.png" alt="ppt" className="w-20 h-20" />
          <img src="https://img.icons8.com/fluency/512/txt.png" alt="txt" className="w-20 h-20" />
          <img src="https://img.icons8.com/color/512/zip.png" alt="zip" className="w-20 h-20" />
          <img src="https://img.icons8.com/color/512/image.png" alt="image" className="w-20 h-20" />
        </div>
      </div>

      {/* Login Box */}
      <div className="z-10 w-full max-w-md p-10 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-all"
            type="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <p className="text-sm text-center text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-teal-600 underline font-medium"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          {message && <p className="text-center text-red-600 mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
}
