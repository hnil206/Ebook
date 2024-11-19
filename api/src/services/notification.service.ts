import { Server, Socket } from 'socket.io';
import Notification from '../models/notification.model';
export async function getNotification(
  userId?: string,
  skip?: number,
  take?: number,
) {
  try {
    const query = { userId };
    const options: any = {
      sort: { createdAt: -1 }, // Sắp xếp theo thời gian tạo giảm dần
      select: '_id title content createdAt', // Chọn các trường cần lấy
    };

    if (typeof take === 'number') {
      options.take = take; // Giới hạn số lượng kết quả
    }
    if (typeof skip === 'number') {
      options.skip = skip; // Bỏ qua số lượng kết quả
    }

    const [notifications, total] = await Promise.all([
      Notification.find(query, null, options),
      Notification.countDocuments(query),
    ]);

    return { notifications, total };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export default class NotificationSocketService {
  private socketIo: Server;
  private userSocketMap = new Map();
  constructor(socketIo: Server) {
    this.socketIo = socketIo;
    this.init();
  }
  init() {
    this.socketIo.on('connection', async (socket) => {
      this.handleConnection(socket);
    });
  }
  async getNotificationsByUserId(
    userId: string,
    numberNoti?: number,
  ): Promise<InstanceType<typeof Notification>[]> {
    let query = Notification.find({ userId }).sort({ createdAt: -1 });
    if (numberNoti) {
      query = query.limit(numberNoti);
    }
    const notifications = await query;
    return notifications;
  }

  async createNotification(
    notification: InstanceType<typeof Notification>,
  ): Promise<InstanceType<typeof Notification>> {
    const socketId = this.userSocketMap.get(notification.userId);
    const savedNotification = await new Notification(notification).save();
    const { userId, ...data } = savedNotification;
    if (socketId) {
      this.socketIo.to(socketId).emit('notification', data);
    }
    return savedNotification;
  }
  async getNotifications(): Promise<InstanceType<typeof Notification>[]> {
    const notification = await Notification.find();
    return notification;
  }
  async connectedUser(userId: string, socketId: string): Promise<void> {
    this.userSocketMap.set(userId, socketId);
  }
  async disconnectedUser(userId: string): Promise<void> {
    this.userSocketMap.delete(userId);
  }
  async handleConnection(socket: Socket): Promise<void> {
    socket.on('register', async (userId: string) => {
      await this.connectedUser(userId, socket.id);
      // console.log(`User ${userId} connected with socket id ${socket.id}`);
    });
    socket.on('createNotification', async (data) => {
      // console.log('create noti');
      const saveNotification = await this.createNotification(data);
      socket.emit('notificationCreated', saveNotification);
    });
    socket.on('getNotifications', async () => {
      // console.log('get noti');
      const notifications = await this.getNotifications();
      // console.log(notifications);
      socket.emit('notifications', JSON.stringify(notifications));
    });
    socket.on('disconnect', async () => {
      await this.disconnectedUser(socket.id);
      // console.log('A user disconnected');
    });
  }
}
