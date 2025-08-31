import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storeSchema } from "@/schema";
import SelectGenreCombobox from "@/components/SelectGenreCombobox";
import genres from "@/utilities/genres";
import { useSetRecoilState } from "recoil";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";

const AddStore = () => {
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  useEffect(() => setPageTitle("Add store"), []);
  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      genre: [],
      image: "",
      year_published: new Date().getFullYear(),
    },
  });
  const navigate = useNavigate();
  const fileRef = form.register("image");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = (values) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("author", values.author);
    formData.append("description", values.description || "");
    formData.append("year_published", String(values.year_published));
    (values.genre || []).forEach((g) => formData.append("genre", g));
    if (values.image) formData.append("image", values.image);

    let promise = axios.post(`${import.meta.env.VITE_BACKEND_URL}/stores`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    toast.promise(promise, {
      loading: "Loading...",
      success: (response) => {
        navigate("/stores/");
        return response.data.message;
      },
      error: (error) => error?.response?.data?.message || error?.message || "Failed to add store",
      finally: () => setIsLoading(false),
    });
  };

  return (
    <div className="grid flex-1 gap-4 p-4 sm:px-6 md:gap-8">
              <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="border-b border-slate-200 dark:border-zinc-800">
              <CardTitle>Add store</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-3 py-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-2">
                    <FormLabel className="text-left">Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Author of the store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year_published"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-left">Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Year Published"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief summary of the store..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem className="space-y-0 sm:col-span-3">
                    <FormLabel className="text-left">Genre</FormLabel>
                    <FormControl>
                      <SelectGenreCombobox
                        options={genres}
                        name="Genre"
                        form={form}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-0 sm:col-span-2">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          placeholder="store Thumbnail"
                          {...fileRef}
                          onChange={(event) => {
                            field.onChange(
                              event.target?.files?.[0] ?? undefined
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
            <CardFooter className="border-t border-slate-200 px-6 py-4 dark:border-zinc-800">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddStore;
