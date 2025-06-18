import { Church, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0071BC] text-white py-3 px-4">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Actual Church Logo */}
        <div className="mb-1">
          <svg width="38" height="24" viewBox="0 0 45 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 14.5C1.5 7.04416 7.54416 1 15 1C22.4558 1 28.5 7.04416 28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54416 28 1.5 21.9558 1.5 14.5Z" stroke="white" strokeWidth="2"/>
            <path d="M43.5 14.5C43.5 7.04416 37.4558 1 30 1C22.5442 1 16.5 7.04416 16.5 14.5C16.5 21.9558 22.5442 28 30 28C37.4558 28 43.5 21.9558 43.5 14.5Z" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-0.5">Living Rock Church</h2>
        <div className="text-base mb-1 leading-tight">
          Building faith, community, and fellowship<br />
          together through Christ's love.
        </div>
        <div className="text-xs opacity-80 mt-1">
          © {new Date().getFullYear()} Living Rock Church. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
