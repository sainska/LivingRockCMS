
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-xiracom-blue">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" /> Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
