import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="flex items-center  px-4 md:px-10">{children}</main>
    </div>
  );
}
