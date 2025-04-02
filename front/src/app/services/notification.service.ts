import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  date: Date;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  addNotification(message: string, link?: string): void {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      read: false,
      date: new Date(),
      link
    };

    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = [newNotification, ...currentNotifications];

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAsRead(id: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification =>
      ({ ...notification, read: true })
    );

    this.notifications.next(updatedNotifications);
    this.unreadCount.next(0);
  }

  private updateUnreadCount(): void {
    const count = this.notifications.getValue().filter(n => !n.read).length;
    this.unreadCount.next(count);
  }
}
