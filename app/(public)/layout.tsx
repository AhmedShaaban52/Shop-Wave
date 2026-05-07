import { ReactNode } from "react";
import Navbar from "./_components/layout/Navbar";
import Footer from "./_components/layout/Footer";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 md:px-10 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}