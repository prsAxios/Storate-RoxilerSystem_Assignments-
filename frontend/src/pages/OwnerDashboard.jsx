import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userIdAtom } from "@/atoms/userData";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OwnerDashboard = () => {
  const userId = useRecoilValue(userIdAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setstores] = useState([]);
  const [stats, setStats] = useState({}); // storeId -> { avg, count }
  const [histograms, setHistograms] = useState({}); // storeId -> {1: n, 2: n, ...}

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/stores`, { params: { ownerId: userId } })
      .then(async ({ data }) => {
        setstores(data.stores || []);
        const ratings = {};
        await Promise.all(
          (data.stores || []).map(async (b) => {
            try {
              const { data: r } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/stores/${b._id}/reviews`
              );
              const list = r.reviews || [];
              const count = list.length;
              const avg = count
                ? Number((list.reduce((a, x) => a + (x.rating || 0), 0) / count).toFixed(2))
                : 0;
              ratings[b._id] = { avg, count };
              const hist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
              list.forEach((rv) => {
                const k = Math.min(5, Math.max(1, rv.rating || 0));
                hist[k] = (hist[k] || 0) + 1;
              });
              setHistograms((prev) => ({ ...prev, [b._id]: hist }));
            } catch (e) {
              ratings[b._id] = { avg: 0, count: 0 };
              setHistograms((prev) => ({ ...prev, [b._id]: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }));
            }
          })
        );
        setStats(ratings);
      })
      .catch((e) => toast.error(e?.response?.data?.message || "Failed to load"))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-full">
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 sm:px-6 md:gap-6">
      <h1 className="text-2xl font-semibold">My Store Ratings</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((b) => (
          <Card key={b._id} className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {b.title}
                {String(b.ownerId) === String(userId) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white text-black border border-slate-300">Owner</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Average rating: {stats[b._id]?.avg ?? 0}</div>
              <div className="text-sm">Total ratings: {stats[b._id]?.count ?? 0}</div>
              <div className="mt-3">
                <Bar
                  data={{
                    labels: ["1", "2", "3", "4", "5"],
                    datasets: [
                      {
                        label: "Ratings count",
                        data: [1, 2, 3, 4, 5].map((k) => histograms[b._id]?.[k] || 0),
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderColor: "rgba(255,255,255,1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
                      y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;


