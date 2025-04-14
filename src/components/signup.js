import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else setMessage("Check your email for confirmation link.");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <input
                type="email"
                placeholder="Email"
                className="border p-2 mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSignup}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Sign Up
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}
