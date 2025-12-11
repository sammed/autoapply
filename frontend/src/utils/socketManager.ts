import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;
let reconnectAttempts = 0;
let lastConnectionAttempt = 0;
const MAX_RECONNECT_DELAY = 30000;
const CONNECTION_THROTTLE = 5000;

enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
}

let connectionState = ConnectionState.DISCONNECTED;

const isBrowser = typeof window !== 'undefined';

const getToken = (): string | null => {
  if (isBrowser) {
    return localStorage.getItem('token');
  }
  return null;
};

const removeToken = (): void => {
  if (isBrowser) {
    localStorage.removeItem('token');
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    initializeSocket();
  }
  return socket!;
};

export const subscribeToInitialApplications = (callback: (data: any) => void) => {
  const currentSocket = getSocket();
  currentSocket.off('applications'); 
  currentSocket.on('applications', callback);
};

export const requestInitialApplications = () => {
  const currentSocket = getSocket();
  
  const emitRequest = () => {
    console.log("Emitting 'get_applications' request.");
    currentSocket.emit('get_applications');
  };
  
  currentSocket.off('connect', emitRequest);
  currentSocket.on('connect', emitRequest);
  
  if (isConnected()) {
    emitRequest();
  }
};

export const subscribeToNewApplications = (
  callback: (data: any) => void
) => {
  const currentSocket = getSocket();
  
  currentSocket.off('new_applications'); 
  
  currentSocket.on('new_applications', (data) => {
    console.log('Received new applications from server:', data);
    callback(data);
  });
};

const initializeSocket = () => {
  if (!isBrowser) {
    console.log('Socket initialization skipped (not in browser environment)');
    return;
  }

  const now = Date.now();
  if (now - lastConnectionAttempt < CONNECTION_THROTTLE) {
    console.log('Connection attempt throttled');
    return;
  }
  lastConnectionAttempt = now;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const token = getToken();

  connectionState = ConnectionState.CONNECTING;

  socket = io(API_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: Math.min(1000 * (2 ** reconnectAttempts), MAX_RECONNECT_DELAY),
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
    connectionState = ConnectionState.CONNECTED;
    reconnectAttempts = 0;
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket:', reason);
    connectionState = ConnectionState.DISCONNECTED;
    if (reason === 'io server disconnect' && socket) {
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    connectionState = ConnectionState.DISCONNECTED;
    reconnectAttempts++;
    if (error.message === 'jwt expired') {
      removeToken();
      if (isBrowser) {
        window.location.href = '/login';
      }
    }
  });

  socket.on('error', (error: any) => {
    console.error('Socket error:', error);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionState = ConnectionState.DISCONNECTED;
    reconnectAttempts = 0;
  }
};

export const isConnected = () => connectionState === ConnectionState.CONNECTED;

export const reconnect = () => {
  if (connectionState !== ConnectionState.CONNECTING) {
    disconnectSocket();
    initializeSocket();
  }
};