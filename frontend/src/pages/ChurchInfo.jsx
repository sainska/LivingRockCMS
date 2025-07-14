
import React from 'react';
import ChurchSettings from "@/components/settings/ChurchSettings";

const ChurchInfo = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Church Information</h1>
      </div>
      <ChurchSettings />
    </div>
  );
};

export default ChurchInfo;
