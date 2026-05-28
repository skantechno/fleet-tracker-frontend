import { io, type Socket } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socket-events'

export type FleetSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let socket: FleetSocket | null = null

export function connect(token: string): FleetSocket {
  if (socket) {
    socket.disconnect()
  }
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
  })
  return socket
}

export function getSocket(): FleetSocket | null {
  return socket
}

export function disconnect(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
