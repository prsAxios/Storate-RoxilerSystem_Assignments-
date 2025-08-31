import { LayoutGrid, Loader2, PlusCircle, Table } from "lucide-react";
import { lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { storeColumns } from "@/components/storeColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
const StoreCard = lazy(() => import("@/components/StoreCard"));
import useStores from "@/hooks/useStores";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userRoleAtom } from "@/atoms/userData";
import { pageTitleAtom } from "@/atoms/meta";

const Homepage = () => {
  const role = useRecoilValue(userRoleAtom);
  const navigate = useNavigate();
  const { stores, isLoading } = useStores();
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  useEffect(() => setPageTitle("Stores"), []);

  return (
    <main className="grid flex-1 items-start p-2 sm:px-4 md:gap-8">
      <Tabs defaultValue="block">
        <div className="flex items-center px-2 pt-2">
          <TabsList>
            <TabsTrigger default value="block" className="flex gap-2">
              <LayoutGrid size={20} />{" "}
              <h3 className="not-hidden sm:block">Stores</h3>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2">
              <Table size={20} /> <h3 className="not-hidden sm:block">Records</h3>
            </TabsTrigger>
          </TabsList>
          {role === "admin" && (
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => {
                  navigate("add");
                }}>
                <PlusCircle size={20} />
                Add store
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="block">
          {isLoading ? (
            <div className="w-full grid items-center">
              <Loader2 className="mx-auto  h-10 w-10 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap">
              {stores?.map((store, index) => (
                <StoreCard key={index} store={store} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="table" className="grid">
          <DataTable
            searchBy="title"
            columns={storeColumns}
            data={stores}></DataTable>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Homepage;
