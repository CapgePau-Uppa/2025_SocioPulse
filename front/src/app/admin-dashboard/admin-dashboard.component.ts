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

    constructor(private adminService: AdminService) {}

    ngOnInit() {
        this.loadRoles();
        this.loadUsers();

    }

	loadRoles(): void {
		this.adminService.getRoles().subscribe(
			(data) => {
				this.roles = data;
				console.log('Rôles récupérés:', this.roles);
				// Si des rôles existent, on sélectionne le premier rôle par défaut et on charge ses permissions
				if (this.roles.length > 0) {
					this.selectedRole = this.roles[0];  // Sélectionne le premier rôle
					this.loadPermissions(this.selectedRole.id);  // Charge les permissions du rôle sélectionné
				} else {
					console.error("Aucun rôle trouvé !");
				}
			},
			(error) => {
				console.error('Erreur lors de la récupération des rôles:', error);
			}
		);
	}
	
	  loadUsers(): void {

		this.adminService.getUsers().subscribe(
		  (data) => {
			this.users = data;
			console.log('Utilisateurs récupérés:', this.users);
		  },
		  (error) => {
			console.error('Erreur lors de la récupération des utilisateurs:', error);
		  }
		);
	  }

	  onRoleChange(role: any): void {
		this.selectedRole = role;
		this.loadPermissions(role.id);
	}
	
	
	loadPermissions(roleId: number): void {
		if (!roleId) {
			console.error('Aucun roleId valide trouvé');
			return;
		}
	
		this.adminService.getPermissions(roleId).subscribe(
			(data) => {
				// Vérifier si "permissions" est un objet
				if (data && data.permissions && typeof data.permissions === 'object') {
					// Transformer l'objet en tableau
					this.permissions = Object.keys(data.permissions).map(key => ({
						name: key, // Le nom de la permission
						value: data.permissions[key] // La valeur de la permission (true/false)
					}));
				} else {
					this.permissions = [];
				}
	
				console.log('Permissions récupérées:', this.permissions);
			},
			(error) => {
				console.error('Erreur lors de la récupération des permissions:', error);
			}
		);
	}
	
	  updateRolePermissions(roleId: number, selectedPermissions: number[]): void {
	
		this.adminService.updateRolePermissions(roleId, selectedPermissions).subscribe(
		  () => {
			console.log('Permissions mises à jour avec succès');
			this.loadRoles();
		  },
		  (error) => {
			console.error('Erreur lors de la mise à jour des permissions:', error);
		  }
		);
	  }
	
	  updateUserRole(userId: number, roleId: number): void {

		this.adminService.updateUserRole(userId, roleId).subscribe(
		  (response) => {
			console.log('Rôle mis à jour avec succès:', response);
			this.loadUsers(); // Rafraîchir la liste des utilisateurs
		  },
		  (error) => {
			console.error('Erreur lors de la mise à jour du rôle:', error);
		  }
		);
	  }
  
    hasPermission(role: any, perm: any): boolean {
        return role.permissions?.some((p: any) => p.id === perm.id) || false;
    }
  
	togglePermission(role: any, perm: any, isChecked: boolean) {
		if (!role || !perm) return;
	
		// Assure-toi que les permissions sont bien définies
		role.permissions = role.permissions || [];
	
		// Met à jour ou ajoute la permission avec sa valeur (0 ou 1)
		role.permissions = role.permissions.map((p: any) => {
			if (p.name === perm.name) {
				p.value = isChecked ? 1 : 0;  // Utilise 1 pour activé et 0 pour désactivé
			}
			return p;
		});
	
		// Récupère les noms des permissions activées (valeur 1)
		const selectedPermissions = role.permissions
			.filter((p: any) => p.value === 1)  // Ne garde que celles activées
			.map((p: any) => p.name);  // Utilise le nom des permissions activées
	
		// Assure-toi qu'aucune permission n'est `null` ou `undefined` avant d'envoyer la requête
		if (selectedPermissions.length === 0) {
			console.error('Aucune permission activée.');
			return;
		}
	
		// Met à jour les permissions dans le backend avec les noms des permissions activées
		this.adminService.updateRolePermissions(role.id, selectedPermissions)
			.subscribe(() => {
				console.log('Permissions mises à jour');
			}, error => {
				console.error('Erreur lors de la mise à jour des permissions:', error);
			});
	}
	
	
	
	
    deleteUser(userId: number) {
        this.adminService.deleteUser(userId).subscribe(() => {
            console.log('Utilisateur supprimé');
            this.users = this.users.filter(u => u.id !== userId);
        });
    }

	getSelectedPermissions(): number[] {
		return this.selectedRole?.permissions?.map((p: any) => p.id) || [];
	}
	
	updatePermissions() {
		const selectedPermissions = this.getSelectedPermissions();
		this.updateRolePermissions(this.selectedRole.id, selectedPermissions);
	}
	
}
