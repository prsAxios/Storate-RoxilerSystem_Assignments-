import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Suspense } from "react";
const StoreCard = ({ store }) => {
  const image = `${import.meta.env.VITE_BACKEND_URL}/stores/${store._id}/image`;
  return (
    <Link
      to={`/stores/` + store._id}
      className="w-full sm:w-1/3 md:w-1/4 lg:w-1/6 xl:58 fixed-height overflow-hidden">
      <div className="relative m-2 group rounded-2xl aspect-w-3 aspect-h-4 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
        <Suspense fallback={<>loading...</>}>
          <img
            src={image}
            alt="store cover"
            className="w-full h-full object-cover object-center transition-transform duration-500 rounded-2xl group-hover:scale-105"
          />
        </Suspense>
        <div className="absolute flex flex-col inset-0 justify-end opacity-0 group-hover:opacity-100 duration-500">
          <div className="absolute group-hover:scale-105 transition-all duration-500 inset-0 rounded-2xl bg-gradient-to-t from-gray-900 via-gray-900/10"></div>
          <h3
            className="z-10 mx-2 text-lg leading-[1.2] line-clamp-2 font-bold text-white"
            title={store.title}>
            {store.title}
          </h3>
          <div className="z-10 mx-2 overflow-hidden text-sm text-gray-300">
            {store.author}
          </div>
          {/* <div className="z-10 mx-2 mt-2 flex flex-wrap gap-2 text-white">
            {store.genre?.slice(0, 3).map((genre, index) => (
              <Badge
                className="bg-zinc-50 text-zinc-900 hover:bg-zinc-50/80"
                key={index}>
                {genre}
              </Badge>
            ))}
            {store.genre?.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{store.genre.length - 3} more
              </span>
            )}
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
