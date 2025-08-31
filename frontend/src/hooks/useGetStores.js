import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const useGetStore = () => {
  const [store, setStore] = useState();
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  let { id } = useParams();
  useEffect(() => {
    setIsDetailLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/stores/` + id)
      .then((response) => {
        setStore(response.data.store);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setIsDetailLoading(false));
  }, [id]);

  return { store, id, isDetailLoading };
};
export default useGetStore;
