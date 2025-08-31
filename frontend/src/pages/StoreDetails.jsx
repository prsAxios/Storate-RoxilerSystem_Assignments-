import NotFound from "@/pages/NotFound";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utilities/formatDate";
import useGetStore from "../hooks/useGetStores";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isLoggedInAtom,
  userAvatarSelector,
  userRoleAtom,
  userIdAtom,

} from "@/atoms/userData";
import Similarstores from "@/components/SimilarStores";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";
const ReviewList = lazy(() => import("@/components/ReviewList"));
const ReviewForm = lazy(() => import("@/components/ReviewForm"));

const StoreDetails = () => {
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  const userAvatar = useRecoilValue(userAvatarSelector);
  useEffect(() => setPageTitle("Stores"), []);

  const { store, id, isDetailLoading } = useGetStore();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const role = useRecoilValue(userRoleAtom);
  const userId = useRecoilValue(userIdAtom);

  const [myReview, setMyReview] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);



  useEffect(() => {
    isLoggedIn &&
      store &&
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/stores/${store?._id}/reviews/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setMyReview(response.data);
          setIsEditing(false);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [isLoggedIn, store, counter]);

  // Owner/Admin rating analysis for this store
  useEffect(() => {
    if (!store) return;
    const canSeeAnalysis =
      role === "admin" || (role === "owner" && String(userId) == String(store.ownerId));
    if (!canSeeAnalysis) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/stores/${store?._id}/reviews`)
      .then((response) => {
        const reviews = response.data.reviews || [];
        setRatingsCount(reviews.length);
        if (reviews.length === 0) {
          setAvgRating(0);
          return;
        }
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        setAvgRating(Number((sum / reviews.length).toFixed(2)));
      })
      .catch(() => {
        setAvgRating(null);
        setRatingsCount(0);
      });
  }, [store, role, userId]);



  const image = `${import.meta.env.VITE_BACKEND_URL}/stores/${store?._id}/image`;
  if (isDetailLoading) {
    return (
      <div className="w-full">
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      </div>
    );
  } else if (!store) {
    return <NotFound />;
  }
  return (
    <div className="grid p-4 sm:p-6 gap-2 dark:text-zinc-50">
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-5xl m-auto">
        <div className="flex flex-col items-center sm:sticky sm:top-[81px] pb-2 rounded-lg h-full">
          <img
            width="512px"
            loading="loading..."
            src={image}
            alt="store cover"
            className="min-w-full md:min-w-lg object-cover rounded-md"
          />
        </div>
        <div className="h-fit w-full space-y-2">
          <div className="w-full h-full border-2 rounded-2xl p-4 border-slate-200 dark:border-zinc-800 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
            <h1 className="scroll-m-20 mb-5 text-4xl font-bold tracking-tight lg:text-5xl">
              {store?.title}
            </h1>
            <div className="flex gap-2 items-end">
              <h3 className="italic">by</h3>
              <h2 className="text-2xl font-semibold tracking-tight">
                {store?.author}
              </h2>
            </div>
            <div className="flex space-x-4 text-sm py-4 my-2 border-b-2 border-t-2 border-slate-200 dark:border-zinc-800">
              <div className="pr-4 border-r-2 text-right border-slate-200 dark:border-zinc-800">
                <h3 className="italic w-24 pb-2">Year Published</h3>
                <h4 className="font-semibold">{store?.year_published}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <h3 className="italic w-full">Genre</h3>
                {store?.genre?.map((genre, index) => (
                  <Badge variant="outline" key={index}>
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            {store?.description && (
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  Description
                </h3>
                <blockquote className="my-4 italic border-slate-200 dark:border-zinc-800">
                  {store?.description}
                </blockquote>
              </div>
            )}
          </div>

          {isLoggedIn && myReview && (
            <div className="relative flex flex-col border-2 rounded-md p-3 sm:p-4 mt-4 w-full overflow-y-auto border-slate-200 dark:border-zinc-800">
              <div className="flex items-center w-full gap-2">
                <img
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg"
                  src={userAvatar}
                  alt="user"
                />
                <div className="flex flex-col items-start">
                  <h4 className="text-lg font-medium tracking-tight">
                    {myReview.userId.firstName + " " + myReview.userId.lastName}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        size={15}
                        key={index}
                        color={myReview.rating >= index + 1 ? "gold" : "grey"}
                        fill={myReview.rating >= index + 1 ? "gold" : "grey"}
                      />
                    ))}
                    <span className="text-gray-500 text-sm ml-3">
                      {formatDate(myReview.createdAt)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="absolute flex top-4 right-2 p-2 rounded-full"
                  onClick={() => setIsEditing(!isEditing)}>
                  <Pencil size={20} />
                </Button>
              </div>
              <blockquote className="ml-1 my-2 sm:my-4 italic text-sm sm:text-base">
                {myReview.content}
              </blockquote>
            </div>
          )}

          {(isEditing || !myReview) && !(role === "owner" && String(userId) == String(store.ownerId)) && (
            <ReviewForm
              store={store}
              isEditing={isEditing}
              reviewId={myReview?._id}
              handleUserReply={() => setCounter(counter + 1)}
            />
          )}

          <div className="flex pb-2">
            {(role === "admin" || (role === "owner" && String(userId) == String(store.ownerId))) && (
              <div className="flex gap-2 sm:justify-end w-full">
                <Button
                  title="Edit store"
                  variant="outline"
                  className="border-2 border-slate-300"
                  onClick={() => navigate(`edit`)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-2 border-red-100 hover:border-red-500 hover:bg-red-500/90 text-red-500 hover:text-zinc-50 dark:text-zinc-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-11/12">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the store data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDeleteLoading(true);
                          let promise = axios.delete(
                            `${import.meta.env.VITE_BACKEND_URL}/stores/` + id,
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );

                          toast.promise(promise, {
                            loading: "Loading...",
                            success: (response) => {
                              navigate("/stores");
                              return response.data.message;
                            },
                            error: (error) => error.response.data.message,
                            finally: () => setIsDeleteLoading(false),
                          });
                        }}>
                        {isDeleteLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                          </>
                        ) : (
                          <>Delete</>
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {(role === "admin" || (role === "owner" && String(userId) == String(store.ownerId))) && (
            <div className="mt-3 border-2 rounded-md p-3 border-slate-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold mb-1">Ratings Analysis</h3>
              <div className="text-sm">Average rating: {avgRating ?? "-"}</div>
              <div className="text-sm">Total ratings: {ratingsCount}</div>
            </div>
          )}
        </div>
      </div>
      <Similarstores store={store} />
      <Suspense
        fallback={
          <div className="w-full grid items-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
          </div>
        }>
        <ReviewList
          store={store}
          userReplyCounter={counter}
          setUserReplyCounter={setCounter}
        />
      </Suspense>
    </div>
  );
};

export default StoreDetails;
