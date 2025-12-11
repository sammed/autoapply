import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Application } from '../types';
import { getSocket, isConnected, reconnect } from '../utils/socketManager';

interface WebSocketComponentProps {
  onApplicationsUpdate: (applications: Application[]) => void;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({
  onApplicationsUpdate,
}) => {
  const [connected, setConnected] = useState<boolean>(isConnected());
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log('Socket connected, requesting initial applications');
      setConnected(true);
      socket.emit('get_applications');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setConnected(false);
    };

    const handleInitialApplications = (incoming: Application[]) => {
      console.log('Received initial batch applications:', incoming.length);
      setApps(incoming);
      onApplicationsUpdate(incoming);
    };

    const handleNewApplications = (newApps: Application[]) => {
      console.log('Received new applications in real-time:', newApps.length);
      setApps(prev => {
        const updated = [...newApps, ...prev];
        onApplicationsUpdate(updated);
        return updated;
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('applications', handleInitialApplications);
    socket.on('new_applications', handleNewApplications);

    if (isConnected()) {
      console.log('Already connected, requesting initial applications');
      socket.emit('get_applications');
    }

    return () => {
      const currentSocket = getSocket();
      currentSocket.off('connect', handleConnect);
      currentSocket.off('disconnect', handleDisconnect);
      currentSocket.off('applications', handleInitialApplications);
      currentSocket.off('new_applications', handleNewApplications);
    };
  }, [onApplicationsUpdate]);

  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      if (isConnected()) {
        getSocket().emit('keepalive');
      } else {
        reconnect();
      }
    }, 30000);

    return () => clearInterval(keepAliveInterval);
  }, []);

  if (!connected) {
    return <Typography>Connecting to server...</Typography>;
  }

  return null;
};

export default WebSocketComponent;
