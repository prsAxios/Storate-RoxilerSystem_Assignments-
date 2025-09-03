import { AlertCircle, Heart, Loader2, MoreVertical, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";


const UserCard = ({ user, handleReload }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Generate realistic human avatar using DiceBear Personas
  const defaultAvatar = `https://api.dicebear.com/8.x/personas/svg?seed=${user._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50&size=256`;
  if (user.picture) console.log(user);

  const handlePromotion = async () => {
    setIsLoading(true);
    let promise = axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/users/${user._id}/promote`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        handleReload();
        return response.data.message;
      },
      error: (error) => error.response.data.message,
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="p-1 w-full col-span-2 sm:w-1/2 lg:w-1/3 xl:w-1/4 text-center">
      <div className="p-2 flex flex-col gap-3 w-full rounded-2xl relative border-slate-200 dark:border-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
        <div className="flex items-center gap-2 p-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <img
            className="w-16 h-16 rounded-full shadow-lg"
            src={user.picture || defaultAvatar}
            alt="user"
          />
          <div className="flex flex-col text-left">
            <h5
              title={user?.firstName + " " + user?.lastName}
              className="w-36 truncate mb-1 text-xl font-medium text-gray-900 dark:text-zinc-50">
              {user?.firstName} {user?.lastName}
            </h5>
            <span
              title={user?.email}
              className="w-40 truncate text-sm text-gray-500">
              {user?.email}
            </span>
          </div>
          <div className="absolute right-4 top-4 flex items-center">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Badge
                variant={user?.role == "admin" ? "default" : "outline"}
                title={user?.role == "admin" ? "Demote User" : "Promote User"}
                className="m-1">
                {user?.role}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <span className="m-2">
                  {user?.role == "admin" ? "Admin" : "User"}
                </span>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlePromotion}>
                  {user?.role == "admin" ? "Demote User" : "Promote User"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
