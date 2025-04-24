import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;  // Format Laravel
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `http://localhost:8000/api/notifications`;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      console.error('User is not authenticated');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private loadNotifications() {
    const headers = this.getAuthHeaders();
    this.http.get<Notification[]>(this.apiUrl, {headers})
      .subscribe(notifications => {
        this.notifications.next(notifications);
        this.updateUnreadCount(notifications);
      });
  }
  private updateUnreadCount(notifications: Notification[]) {
    const headers = this.getAuthHeaders();
    const count = notifications.filter(n => !n.read).length;
    this.unreadCount.next(count);
  }

  getNotifications() {
    const headers = this.getAuthHeaders();
    return this.notifications.asObservable();
  }

  getUnreadCount() {
    const headers = this.getAuthHeaders();
    return this.unreadCount.asObservable();
  }

  addNotification(message: string, link?: string) {
    const headers = this.getAuthHeaders();
    return this.http.post<Notification>(this.apiUrl, { message, link }, {headers })
      .pipe(
        tap(newNotification => {
          const current = this.notifications.value;
          this.notifications.next([newNotification, ...current]);
          this.updateUnreadCount([newNotification, ...current]);
        })
      ).subscribe();
  }

  markAsRead(notification: Notification) {
    const headers = this.getAuthHeaders();
    return this.http.put<Notification>(`${this.apiUrl}/${notification.id}/read`, {}, {headers })
      .pipe(
        tap(updatedNotification => {
          const current = this.notifications.value;
          const updated = current.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          );
          this.notifications.next(updated);
          this.updateUnreadCount(updated);
        })
      ).subscribe();
  }

  markAllAsRead() {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/read-all`, {}, { headers })
      .pipe(
        tap(() => {
          const current = this.notifications.value;
          const updated = current.map(n => ({ ...n, read: true }));
          this.notifications.next(updated);
          this.unreadCount.next(0);
        })
      ).subscribe();
  }

  removeNotification(notification: Notification, event?: Event) {
    const headers = this.getAuthHeaders();
    if (event) {
      event.stopPropagation();
    }

    return this.http.delete<void>(`${this.apiUrl}/${notification.id}`, {headers })
      .pipe(
        tap(() => {
          const current = this.notifications.value;
          const updated = current.filter(n => n.id !== notification.id);
          this.notifications.next(updated);
          this.updateUnreadCount(updated);
        })
      ).subscribe();
  }

  // Pour le débogage - ajoute une notification test
  addDebugNotification() {
    const headers = this.getAuthHeaders();
    return this.http.post<Notification>(this.apiUrl, {message:"message_debug",link:"message2"}, { headers })
      .pipe(
        tap(notification => {
          const current = this.notifications.value;
          this.notifications.next([notification, ...current]);
          this.updateUnreadCount([notification, ...current]);
        })
      ).subscribe();
  }
}
