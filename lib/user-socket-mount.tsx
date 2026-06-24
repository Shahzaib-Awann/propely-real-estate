"use client";

// @/lib/user-socket-mount.tsx


import { useEffect } from 'react'
import { socket } from './socket';
import { SOCKET_EVENTS } from './socket-events';

const UserSocketMount = ({
  userId,
}: { userId : number}) => {

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, userId);
    };
  }, [userId]);

  return null;
}

export default UserSocketMount