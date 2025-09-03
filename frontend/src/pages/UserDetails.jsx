import NotFound from "@/pages/NotFound";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";


const UserDetails = () => {
  const [user, setUser] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  let { userId } = useParams();
  const pictureUrl = `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/picture`;
  // Generate realistic human avatar using DiceBear Personas
  const defaultAvatar = `https://api.dicebear.com/8.x/personas/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50&size=256`;
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  useEffect(() => setPageTitle("User Profile"), []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="w-full">
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <NotFound />;
  }

  return (
    <div className="mx-auto my-52 flex p-4 w-full flex-1 items-center flex-grow col-span-2 max-w-xl text-center">
      <div className="p-2 flex flex-col gap-3 w-full h-fit rounded-2xl border relative border-slate-200 dark:border-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
        <div className="flex flex-col text-center items-center justify-center gap-4 px-auto py-10 border-b border-slate-200 dark:border-zinc-800">
          <img
            className="absolute w-32 h-32 -top-20 rounded-full shadow-lg p-3 border-2 bg-slate-50 border-slate-200 dark:bg-zinc-950 dark:border-zinc-800"
            src={user.picture ? user.picture : pictureUrl}
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
            alt="user"
          />
          <div className="flex flex-col justify-center">
            <h5
              title={user?.firstName + " " + user?.lastName}
              className="w-full truncate mb-1 text-3xl sm:text-4xl font-medium text-gray-900 dark:text-zinc-50">
              {user?.firstName} {user?.lastName}
            </h5>
            <span
              title={user?.email}
              className="w-full truncate text-2xl sm:text-3xl text-gray-500">
              {user?.email}
            </span>
          </div>
          <div className="">
            <Badge variant="outline" className="ml-auto text-lg">
              {user?.role}
            </Badge>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDetails;
