import { useState, useEffect } from "react";
import { supabase } from "./components/supabaseClient";
import AuthForm from "./components/AuthForm";
import FileManager from "./components/FileManager";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className={user ? "min-h-screen bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100 p-6 flex flex-col justify-between" : "min-h-screen bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100 p-6 flex flex-col justify-between"}>
      {!user ? (
        <AuthForm />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 py-4 px-8 bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100 shadow-xl rounded-lg">
            <div className="flex items-center space-x-2">
              {/* Logo Section from AuthForm */}
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-tr from-teal-400 to-purple-500 p-3 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m4-10l2 2m-2-2v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">NG-Drive</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-gradient-to-r from-gray-800 to-gray-900 rounded-md shadow-md group hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition duration-300 ease-out"></span>
              <span className="relative z-10">Logout</span>
            </button>
          </div>
          <FileManager />

          {/* Footer */}
          <footer className="mt-10 py-4 px-8 bg-gradient-to-r from-lime-100 via-lime-200 to-lime-100 rounded-lg shadow-inner text-center">
            <p className="text-gray-700 text-sm">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-900">NG-Drive</span>. All rights reserved.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
