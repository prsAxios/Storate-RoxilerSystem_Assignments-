/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function Similarstores({ stores = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Similar stores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-40 w-full bg-slate-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar stores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stores.map((store) => (
          <Link
            key={store._id}
            to={`/stores/${store._id}`}
            className="group space-y-2"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
              {store.coverImage ? (
                <img
                  src={store.coverImage}
                  alt={store.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 dark:bg-zinc-700">
                  <span className="text-slate-400 dark:text-zinc-500">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium line-clamp-2 group-hover:underline">
                {store.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                {store.author?.name || 'Unknown Author'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
