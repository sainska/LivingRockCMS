
import { Church, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-xiracom-blue text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Living Rock Church</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Building faith, community, and fellowship together through Christ's love.
            </p>
            <p className="text-xs opacity-75">
              © {new Date().getFullYear()} Living Rock Church. All rights reserved.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Faith Street, Hope City, HC 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-ROCK</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@livingrockchurch.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="/events" className="hover:text-xiracom-orange transition-colors">
                Events
              </a>
              <a href="/ministry" className="hover:text-xiracom-orange transition-colors">
                Ministries
              </a>
              <a href="/communication" className="hover:text-xiracom-orange transition-colors">
                Messages
              </a>
              <a href="/finances" className="hover:text-xiracom-orange transition-colors">
                Giving
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
