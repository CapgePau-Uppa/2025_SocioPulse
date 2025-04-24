// src/app/components/notification-bell/notification-bell.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../services/notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AsyncPipe, DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatBadge} from '@angular/material/badge';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    MatIcon,
    MatBadge
  ],
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit {
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  showNotifications = false;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.getNotifications();
    this.unreadCount$ = this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  ngOnInit(): void {
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;

  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification);
    console.log("read");

  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    this.notificationService.removeNotification(notification);
  }

  // Méthode de débogage
  addTestNotification() {
    this.notificationService.addDebugNotification();
  }
}
