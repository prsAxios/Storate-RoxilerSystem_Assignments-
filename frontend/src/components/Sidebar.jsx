/* eslint-disable */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoggedInAtom,
  userIdAtom,
  userRoleAtom,
} from "@/atoms/userData";
import { toast } from "sonner";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const role = useRecoilValue(userRoleAtom);
  const userId = useRecoilValue(userIdAtom);
  const navigate = useNavigate();
  return (

    <aside className="fixed inset-y-0 left-0 z-50 w-48 dark:bg-zinc-950 dark:border-zinc-800 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center ">Storate.</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {isLoggedIn && userId ? (
          <NavLink
            to={"/users/" + userId}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-slate-200 dark:bg-zinc-800' : ''}`
            }
          >
            Profile
          </NavLink>
        ) : (
          <Link
            to="stores"
            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-center"
          >
            store World
          </Link>
        )}

        <NavLink
          to="stores"
          className={({ isActive }) =>
            `p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-slate-200 dark:bg-zinc-800' : ''}`
          }
        >
          Home
        </NavLink>

        {role === "owner" && (
          <NavLink
            to="owner"
            end
            className={({ isActive }) =>
              `p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-slate-200 dark:bg-zinc-800' : ''}`
            }
          >
            Owner Dashboard
          </NavLink>
        )}



        {role === "admin" && (
          <NavLink
            to="users"
            end
            className={({ isActive }) =>
              `p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-slate-200 dark:bg-zinc-800' : ''}`
            }
          >
            Users
          </NavLink>
        )}
      </nav>

      <div className="mt-auto pt-4">
        {isLoggedIn ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              toast.success("Logged Out Successfully");
            }}
            className="w-full p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-left"
          >
            Log In
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
