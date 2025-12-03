export interface User {
  firstName: string;
  lastName: string;
  username: string; // Combined first+last
}

export interface Room {
  id: string;
  name: string;
  password?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  senderName: string;
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    data: string; // Base64
  };
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  CHAT = 'CHAT'
}