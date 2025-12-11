import { io, Socket } from 'socket.io-client';
import { Application, ApplicationDetails } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let socket: Socket | null = null;

const ensureBrowser = () => {
  if (typeof window === 'undefined') {
    throw new Error('Socket API cannot be used on the server side.');
  }
};

export const getSocket = (): Socket => {
  ensureBrowser();

  if (!API_URL) {
    console.error('NEXT_PUBLIC_API_URL is not defined.');
    throw new Error('API URL is not configured.');
  }

  if (!socket) {
    const token = window.localStorage.getItem('token') ?? undefined;

    socket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[socket] connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected:', reason);
    });

    socket.on('connect_error', (error: Error & { message?: string }) => {
      console.error('[socket] connect_error:', error.message);

      if (error.message === 'jwt expired') {
        window.localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });
  }

  return socket;
};

export const fetchApplications = (timeoutMs = 10000): Promise<Application[]> =>
  new Promise((resolve, reject) => {
    try {
      const socket = getSocket();

      const timeout = setTimeout(() => {
        console.error('[socket] fetchApplications timed out');
        reject(new Error('Timed out while fetching applications'));
      }, timeoutMs);

      socket.emit('get_applications');

      socket.once('applications', (applications: Application[]) => {
        clearTimeout(timeout);
        resolve(applications);
      });

      socket.once('applications_error', (error: { message?: string }) => {
        clearTimeout(timeout);
        reject(new Error(error?.message || 'Unknown applications_error'));
      });
    } catch (err) {
      reject(err);
    }
  });

export const createLetter = (
  applicationId: string,
  timeoutMs = 15000,
): Promise<void> =>
  new Promise((resolve, reject) => {
    try {
      const socket = getSocket();

      const timeout = setTimeout(() => {
        console.error('[socket] createLetter timed out');
        reject(new Error('Timed out while creating letter'));
      }, timeoutMs);

      socket.emit('create_letter', { applicationId });

      socket.once('letter_success', () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.once('letter_error', (error: { error?: string }) => {
        clearTimeout(timeout);
        reject(new Error(error?.error || 'Unknown letter_error'));
      });
    } catch (err) {
      reject(err);
    }
  });

export const onNewApplications = (
  callback: (applications: Application[]) => void,
): (() => void) => {
  const socket = getSocket();

  const handler = (apps: Application[]) => {
    callback(apps);
  };

  socket.on('new_applications', handler);

  return () => {
    socket.off('new_applications', handler);
  };
};

export const disconnect = (): void => {
  if (socket) {
    console.log('[socket] disconnecting');
    socket.disconnect();
    socket = null;
  }
};

export const fetchApplicationById = (
  applicationId: string,
  timeoutMs = 10000,
): Promise<ApplicationDetails> =>
  new Promise((resolve, reject) => {
    try {
      const socket = getSocket();

      const timeout = setTimeout(() => {
        console.error('[socket] fetchApplicationById timed out');
        reject(new Error('Timed out while fetching application details'));
      }, timeoutMs);

      socket.emit('get_application', { applicationId });

      socket.once('application', (app: ApplicationDetails) => {
        clearTimeout(timeout);
        resolve(app);
      });

      socket.once('application_error', (error: { message?: string }) => {
        clearTimeout(timeout);
        reject(new Error(error?.message || 'Unknown application_error'));
      });
    } catch (err) {
      reject(err);
    }
  });
