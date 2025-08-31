
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import useUserData from "@/hooks/useUserData";
import axios from "axios";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

function App() {
  // Initialize user data and authentication state
  useUserData();
  
  useEffect(() => {
    const logVisit = async () => {
      const userAgent = navigator.userAgent;
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/log-visit`,
        {
          userAgent,
        }
      );
      console.log(`Total unique visitors: ${data.totalVisitors}.`);
      console.log(`You have visited ${data.totalVisits} time(s).`);
    };
    logVisit();
  }, []);

  // Google One Tap removed

  return (
    <div className="flex min-h-screen w-full dark:bg-zinc-950 dark:text-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-48">
        <Header />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default App;
