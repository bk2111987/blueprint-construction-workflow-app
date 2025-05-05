import socketService from './socket';

class NotificationService {
  constructor() {
    this.listeners = new Map();
    this.notifications = [];
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    const socket = socketService.connect();
    if (!socket) return;

    // Project notifications
    socket.on('project_updated', (data) => {
      this.createNotification({
        type: 'project',
        title: 'Project Update',
        message: `Project "${data.title}" has been updated`,
        data
      });
    });

    // Bid notifications
    socket.on('new_bid', (data) => {
      this.createNotification({
        type: 'bid',
        title: 'New Bid Received',
        message: `New bid received for project "${data.projectTitle}"`,
        data
      });
    });

    socket.on('bid_status_changed', (data) => {
      this.createNotification({
        type: 'bid',
        title: 'Bid Status Updated',
        message: `Your bid for project "${data.projectTitle}" has been ${data.status}`,
        data
      });
    });

    // Task notifications
    socket.on('task_updated', (data) => {
      this.createNotification({
        type: 'task',
        title: 'Task Update',
        message: `Task "${data.title}" has been updated`,
        data
      });
    });

    // Message notifications
    socket.on('message_received', (data) => {
      this.createNotification({
        type: 'message',
        title: 'New Message',
        message: `New message from ${data.senderName}`,
        data
      });
    });

    // Material notifications
    socket.on('low_stock_alert', (data) => {
      this.createNotification({
        type: 'material',
        title: 'Low Stock Alert',
        message: `Material "${data.name}" is running low on stock`,
        data
      });
    });
  }

  createNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners(newNotification);

    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification);
  }

  async showBrowserNotification(notification) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png' // Add your app icon path
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo192.png'
        });
      }
    }
  }

  getNotifications(filters = {}) {
    let filtered = [...this.notifications];

    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.read);
    }

    return filtered;
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners(notification);
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  clearNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(callback) {
    const id = Symbol();
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  notifyListeners(notification = null) {
    this.listeners.forEach(callback => {
      if (notification) {
        callback(notification);
      } else {
        callback();
      }
    });
  }

  // Role-specific notification filters
  getContractorNotifications() {
    return this.getNotifications({
      type: ['project', 'bid', 'task']
    });
  }

  getVendorNotifications() {
    return this.getNotifications({
      type: ['material', 'message']
    });
  }

  getSubcontractorNotifications() {
    return this.getNotifications({
      type: ['bid', 'task', 'message']
    });
  }

  getCustomerNotifications() {
    return this.getNotifications({
      type: ['project', 'message']
    });
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;
