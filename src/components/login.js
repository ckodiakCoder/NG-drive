import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
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
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}
