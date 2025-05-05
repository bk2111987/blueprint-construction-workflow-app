import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Project room management
  joinProject(projectId) {
    if (!this.socket || !projectId) return;
    this.socket.emit('join_room', { projectId });
  }

  leaveProject(projectId) {
    if (!this.socket || !projectId) return;
    this.socket.emit('leave_room', { projectId });
  }

  // User room management
  joinUserRoom(userId) {
    if (!this.socket || !userId) return;
    this.socket.emit('join_room', { userId });
  }

  leaveUserRoom(userId) {
    if (!this.socket || !userId) return;
    this.socket.emit('leave_room', { userId });
  }

  // Typing indicators
  sendTypingStatus(receiverId, typing = true) {
    if (!this.socket || !receiverId) return;
    this.socket.emit('typing', {
      receiverId,
      senderId: JSON.parse(localStorage.getItem('user'))?.id,
      typing
    });
  }

  // Message listeners
  onNewMessage(callback) {
    if (!this.socket) return;
    this.socket.on('message_received', callback);
  }

  onProjectMessage(callback) {
    if (!this.socket) return;
    this.socket.on('new_project_message', callback);
  }

  onTypingStatus(callback) {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  // Project updates
  onProjectUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('project_updated', callback);
  }

  // Bid notifications
  onNewBid(callback) {
    if (!this.socket) return;
    this.socket.on('new_bid', callback);
  }

  onBidStatusChange(callback) {
    if (!this.socket) return;
    this.socket.on('bid_status_changed', callback);
  }

  // Task notifications
  onTaskUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('task_updated', callback);
  }

  // Material notifications
  onLowStock(callback) {
    if (!this.socket) return;
    this.socket.on('low_stock_alert', callback);
  }

  // Remove event listeners
  removeListener(event) {
    if (!this.socket) return;
    this.socket.off(event);
  }

  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  // Check connection status
  isConnected() {
    return this.connected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
