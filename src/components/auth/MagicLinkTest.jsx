import React from 'react';
import MagicLink from './MagicLink';

const MagicLinkTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Magic Link Test</h1>
        <MagicLink allowSignUp={false} />
      </div>
    </div>
  );
};

export default MagicLinkTest; 