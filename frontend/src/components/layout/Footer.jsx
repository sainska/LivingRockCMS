import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-4 px-6 text-center text-sm text-[#0071BC]">
      Living Rock Church Management System &copy; {new Date().getFullYear()} | Powered by Xiracom
    </footer>
  );
}
