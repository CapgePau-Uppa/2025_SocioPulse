import { Component, OnInit } from '@angular/core';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  permissions: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  changeRole(userId: number, newRoleId: number) {
    this.adminService.updateUserRole(userId, newRoleId).subscribe(() => {
      this.loadUsers();
    });
  }

  updatePermissions(roleId: number, newPermissions: number[]) {
    this.adminService.updateRolePermissions(roleId, newPermissions).subscribe(() => {
      this.loadUsers();
    });
  }
}
