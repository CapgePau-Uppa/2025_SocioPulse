import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

interface Permission {
	name: string;
	value: boolean;
}

interface Role {
	id: number;
	name: string;
	permissions: Permission[];
}

@Component({
    selector: 'app-admin-dashboard',

    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule
    ]
})
export class AdminDashboardComponent implements OnInit {
    roles: any[] = [];
    users: any[] = [];
    permissions: any[] = [];
	displayedColumns: string[] = ['name', 'role', 'actions'];

    selectedRole: any = null;
    selectedUser: any = null;

    constructor(private toastr:ToastrService,private adminService: AdminService) {}

    ngOnInit() {
        this.loadRoles();
        this.loadUsers();
    }

	loadRoles(): void {
		this.adminService.getRoles().subscribe(
			(data) => {
				this.roles = data;
				console.log('Roles retrieved:', this.roles);
				// If roles exist, select the first role by default and load its permissions
				if (this.roles.length > 0) {
					this.selectedRole = this.roles[0];  // Select the first role
					this.loadPermissions(this.selectedRole.id);  // Load permissions for the selected role
				} else {
					console.error("Rôle non trouvé!");
          this.toastr.error("No roles found!");
				}
			},
			(error) => {
        this.toastr.error("Erreur pour acquérir les rôles");
				console.error('Error fetching roles:', error);
			}
		);
	}

	loadUsers(): void {
		this.adminService.getUsers().subscribe(
			(data) => {
				this.users = data;
				console.log('Users retrieved:', this.users);
			},
			(error) => {
				console.error('Error fetching users:', error);
        this.toastr.error("Erreur pour acquérir les utilisateurs");
			}
		);
	}

	onRoleChange(role: any): void {
		this.selectedRole = role;
		this.loadPermissions(role.id);
	}

	loadPermissions(roleId: number): void {
		if (!roleId) {
			console.error('No valid roleId found');
      this.toastr.error("RoleId non trouvé");
			return;
		}

		this.adminService.getPermissions(roleId).subscribe(
			(data) => {
				if (data && data.permissions && typeof data.permissions === 'object') {
					this.permissions = Object.keys(data.permissions).map(key => ({
						name: key,
						value: !!data.permissions[key] // Convert to boolean
					}));

					// Assign these permissions to the selected role
					this.selectedRole.permissions = [...this.permissions];
				} else {
					this.permissions = [];
					this.selectedRole.permissions = [];
				}

				console.log('Permissions retrieved:', this.permissions);
			},
			(error) => {
				console.error('Error fetching permissions:', error);
			}
		);
	}

	updateRolePermissions(roleId: number, selectedPermissions: number[]): void {
		this.adminService.updateRolePermissions(roleId, selectedPermissions).subscribe(
		  () => {
			console.log('Permissions successfully updated');
			this.loadRoles();
		  },
		  (error) => {
			console.error('Error updating permissions:', error);
		  }
		);
	}

	updateUserRole(userId: number, roleId: number): void {
		this.adminService.updateUserRole(userId, roleId).subscribe(
		  (response) => {
			console.log('Role successfully updated:', response);
			this.loadUsers(); // Refresh the user list
		  },
		  (error) => {
			console.error('Error updating role:', error);
		  }
		);
	}

	hasPermission(role: any, perm: any): boolean {
		return role.permissions?.some((p: any) => p.id === perm.id) || false;
	}

	togglePermission(role: any, perm: any, isChecked: boolean) {
		if (!role || !perm) return;

		// Ensure the role has a permissions array
		if (!role.permissions) {
			role.permissions = [];
		}

		// Check if the permission already exists
		let existingPermission = role.permissions.find((p: any) => p.name === perm.name);
		if (existingPermission) {
			existingPermission.value = isChecked;
		} else {
			// Add the permission if it doesn't exist
			role.permissions.push({ name: perm.name, value: isChecked });
		}

		console.log('Permissions updated locally:', role.permissions);
	}

	deleteUser(userId: number) {
		this.adminService.deleteUser(userId).subscribe(() => {
			console.log('User deleted');
      this.toastr.info("Utilisateur supprimé");
			this.users = this.users.filter(u => u.id !== userId);
		});
	}

	getSelectedPermissions(): number[] {
		return this.selectedRole?.permissions?.map((p: any) => p.id) || [];
	}

	updatePermissions() {
		if (!this.selectedRole || !this.selectedRole.permissions) {
      this.toastr.error("Aucun rôle ou permission trouvé");
			console.error("No role or permissions found");
			return;
		}

		// Force `0` or `1`
		const selectedPermissions: Record<string, number> = this.selectedRole.permissions.reduce((acc: Record<string, number>, p: Permission) => {
			acc[p.name] = p.value ? 1 : 0; // Key-value structure
			return acc;
		}, {} as Record<string, number>);

		console.log('📡 Data sent:', JSON.stringify(selectedPermissions));

		const permissionsArray = Object.values(selectedPermissions);
		this.adminService.updateRolePermissions(this.selectedRole.id, permissionsArray).subscribe(
			() => {
				console.log('Permissions successfully updated');
        this.toastr.success("Permissions mises à jour");
			},
			(error) => {
				console.error('Error updating permissions:', error);
        this.toastr.error("Erreur de mise à jour des permissions");
			}
		);
	}
}
