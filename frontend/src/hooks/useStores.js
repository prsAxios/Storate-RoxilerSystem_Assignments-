import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const useStores = (genre) => {
  const [stores, setStores] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let searchQuery = genre || queryParams.get("q") || "";
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/stores`, {
        params: { q: searchQuery },
      })
      .then((response) => {
        setStores(response.data.stores);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }, [location.search, genre]);

  return { stores, isLoading };
};

export default useStores;
