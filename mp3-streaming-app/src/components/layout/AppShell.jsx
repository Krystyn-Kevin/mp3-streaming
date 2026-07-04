import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import RightRail from "./RightRail";
import MobileNav from "./MobileNav";
import PlayerBar from "../player/PlayerBar";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

export default function AppShell() {
  const [searchQuery, setSearchQuery] = useState("");
  const [railOpen, setRailOpen] = useState(true);

  useKeyboardShortcuts();

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text-primary">
      <Sidebar className="hidden md:flex md:w-[240px] md:flex-shrink-0" />

      <main className="flex-1 overflow-y-auto px-5 pb-32 pt-6 md:px-9 md:pb-28 md:pt-8">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Outlet context={{ searchQuery }} />
      </main>

      {railOpen && <RightRail className="hidden w-[320px] flex-shrink-0 lg:block" />}

      <MobileNav />
      <PlayerBar onToggleQueue={() => setRailOpen((v) => !v)} queueOpen={railOpen} />
    </div>
  );
}
