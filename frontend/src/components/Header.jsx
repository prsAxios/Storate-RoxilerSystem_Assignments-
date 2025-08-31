import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CollapsibleSidebar from "./CollapsibleSidebar";
import { useRecoilValue } from "recoil";
import { userRoleAtom } from "@/atoms/userData";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = useRecoilValue(userRoleAtom);
  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.key === 114 || (e.ctrlKey && e.key === "k")) {
        if (document.getElementById("search") !== document.activeElement) {
          e.preventDefault();
          console.log("Search is not in focus");
          document.getElementById("search").focus();
        } else {
          console.log("Default action of CtrlF");
          return true;
        }
      }
    });
  }, []);
  return (
    <header className="sticky top-0 py-2 z-30 flex h-14 items-center gap-2 px-4 sm:h-auto bg-zinc-950 sm:px-6 shadow-2xl">
      <CollapsibleSidebar />


      <form
        className="relative sm:ml-auto flex-1 sm:grow-0 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/stores?q=${search}`);
        }}>
        <Search className="absolute left-2.5 top-2.5 h-5 w-5" />
        <Input
          id="search"
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-10 pr-14 sm:w-[200px] lg:w-[336px]"
          onChange={(e) => {
            setSearch(e.target.value.trim());
          }}
        />
        <span className="hidden sm:flex absolute right-24">
          <kbd className="pointer-events-none border-slate-200 inline-flex h-6 select-none items-center gap-1 rounded border my-2 px-2 text-[15px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </span>
        <Button variant="outline">Search</Button>
      </form>
      <div className="flex items-center justify-center gap-2">
        {role === "owner" && (
          <Link to="/stores/add">
            <Button className="bg-white text-black hover:bg-slate-200">+ Add store</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
