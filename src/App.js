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
              {/* Logo Section */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="32" height="32" className="text-blue-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-13h4v6h-4zm0 8h4v2h-4z"></path>
              </svg>
              <span className="text-3xl font-semibold text-gray-900 tracking-tight">NG-Drive</span>
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
