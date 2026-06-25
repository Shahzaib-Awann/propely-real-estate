 "use client";

 // @/components/providers/socket/user-socket-register.tsx

import { socket } from '@/lib/socket/client';
import { SOCKET_EVENTS } from '@/lib/socket/socket-events';
import { useEffect } from 'react';

const UserSocketMount = ({
  userId,
}: { userId : number}) => {

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);

    return () => {
      socket.emit(SOCKET_EVENTS.UNREGISTER_USER, userId);
  };
}, [userId]);

  return null;
}

export default UserSocketMount