import React, { useEffect, useState } from "react";
import { User,UserRound } from "lucide-react";

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const YOUR_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwS2AhCtWAtiDIea9UmLcfViS5huIRzXSmHe1KW73z9fXsVsTW5KhF4754xePTAh0Nstg/exec"; // <-- อย่าลืมเปลี่ยน URL

  useEffect(() => {
    const fetchAndIncrementVisitorCount = async () => {
      try {

        console.log("Attempting to increment visitor count and fetch new count.");
        const response = await fetch(YOUR_SCRIPT_WEB_APP_URL);
        const data = await response.json();

        if (data && typeof data.visits === 'number') {
          setVisitorCount(data.visits);
          console.log("Visitor count updated:", data.visits);
        } else {
          console.error("Invalid data received from web app:", data);
        }
      } catch (error) {
        console.error("Error fetching or incrementing visitor count:", error);
      }
    };

    fetchAndIncrementVisitorCount();
  }, []);

  return (
    <div className="
      inline-flex items-center space-x-2
      bg-indigo-100 text-indigo-800
      px-3 py-1 rounded-md
      border border-indigo-200
      shadow-sm
    ">
      <UserRound className="w-4 h-4 text-indigo-600" />
      <span className="text-sm font-medium">{visitorCount.toLocaleString()}</span>
    </div>
  );
};

export default VisitorCounter;