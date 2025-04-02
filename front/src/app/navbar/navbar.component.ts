import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription } from 'rxjs';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-navbar',
  imports: [
    RouterLink,
    MatToolbar,
    MatAnchor,
    MatButton,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatIcon,
    CommonModule,
    MatIconButton,
    MatMenu,
    MatBadge,
    MatMenuTrigger
  ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  /// User properties
    isLoggedIn: boolean = false;
    userName: string | null = null;
    userRole: string | null = null;
    canCreate: boolean = false; // Property for checking permissions

  /// Notification properties
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscriptions: Subscription[] = [];


  private http: HttpClient = inject(HttpClient);


    constructor(
        private toastr: ToastrService,
        private dialog: MatDialog,
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
      this.loadUserData();
      this.loadNotifications();
    }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadNotifications() {
    // Récupérer les notifications
    this.subscriptions.push(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      }),
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }
  markAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  openNotification(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  goToAccessRequests() {
        this.router.navigate(['/access-requests']);
    }

    /**
     * Loads user information and permissions dynamically from sessionStorage
     */
    loadUserData(): void {
        const userId = sessionStorage.getItem('user_id');

        if (userId) {
            this.isLoggedIn = true;
            this.userName = sessionStorage.getItem('username');
            this.userRole = sessionStorage.getItem('role');
            this.canCreate = sessionStorage.getItem('canCreate') === '1';
        } else {
            this.isLoggedIn = false;
            this.userName = null;
            this.userRole = null;
            this.canCreate = false;
        }
    }

    /**
     * Opens the login dialog and handles authentication
     */
    openDialog(): void {
        const dialogRef = this.dialog.open(LoginModalComponent, { width: '400px' });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                try {
                    const response = await this.authService.login(result.email, result.password);

                    console.log('User response:', response.user); // Debugging

                    sessionStorage.setItem('auth_token', response.token);
                    sessionStorage.setItem('user_id', response.user.id);
                    sessionStorage.setItem('username', response.user.name);
                    sessionStorage.setItem('email', response.user.email);
                    sessionStorage.setItem('role', response.user.role);
                    sessionStorage.setItem('entreprise_id', response.user.entreprise_id);
                    sessionStorage.setItem('canCreate', response.user.permissions.canCreate.toString());
                    console.log('Session storage:', sessionStorage); // Debugging
                    this.isLoggedIn = true;
                    this.userName = response.user.name;
                    this.userRole = response.user.role;
                    this.canCreate = sessionStorage.getItem('canCreate') === '1';
                    this.toastr.success("Connexion réussie!");
                    this.router.navigate(['/'])
                } catch (error) {
                    this.toastr.error('Erreur de connexion');
                    console.error('Login error', error);
                }
            } else {
                console.log('La dialog a été fermée sans soumission.');
            }
        });
    }

    /**
     * Logs out the user and clears session data
     */
    logout(): void {
        sessionStorage.clear();
        this.isLoggedIn = false;
        this.userName = null;
        this.userRole = null;
        this.canCreate = false;
        this.router.navigate(['/']);
        this.toastr.success("Déconnexion réussie");
    }

    @Input() sidenav!: MatSidenav;

    /**
     * Toggles the sidenav menu
     */
    toggleSidenav(): void {
        this.sidenav.toggle();
    }
}
