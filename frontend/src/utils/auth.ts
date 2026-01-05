import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket;

function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL as string);
  }
  return socket;
}

export function login(username: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = getSocket();

    socket.emit('login', { username, password });

    socket.once('login_success', (data) => {
      localStorage.setItem('token', data.access_token);
      resolve(true);
    });

    socket.once('login_error', () => {
      resolve(false);
    });
  });
}

export function register(username: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = getSocket();

    socket.emit('register', { username, password });

    socket.once('register_success', () => {
      resolve(true);
    });

    socket.once('register_error', () => {
      resolve(false);
    });
  });
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = undefined as unknown as Socket;
  }
}