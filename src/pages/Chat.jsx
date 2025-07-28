import React from 'react';
import Chat from '@/components/communication/Chat';
import { useAuth } from '@/contexts/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  if (!user) return <div>Login required</div>;
  return <Chat userId={user.id} />;
};

export default ChatPage; 