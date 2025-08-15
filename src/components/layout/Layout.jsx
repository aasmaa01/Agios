import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        {/* Page content from child routes will be rendered here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
