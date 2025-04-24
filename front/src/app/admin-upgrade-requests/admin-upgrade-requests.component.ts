import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CompanyService } from '../services/company.service';
import {ToastrService} from 'ngx-toastr';

interface Entreprise {
  id: number;
  nom: string;
  siren: string;
  type_entreprise: 'TPE/PME' | 'GE' | 'ETI' | 'Association' | 'Organisme de recherche' |
                    'EPIC' | 'Etablissement public' | 'GIE' | 'Organisme de formation' | 'Autre';

}

interface User {
  id: number;
  name: string;
  prenom: string;
  email: string;
  role_id: number;
  entreprise_id?: number | null;
  created_at: string;
  updated_at: string;
  entreprise?: Entreprise | null;
  role?: {
    id: number;
    name: string;
    description: string;
  } | null;
}

interface UpgradeRequest {
  id: number;
  user_id: number;
  role_id: number;
  entreprise_id?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  user?: User;
  entreprise?: Entreprise;
}

@Component({
  selector: 'app-admin-upgrade-requests',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './admin-upgrade-requests.component.html',
  styleUrl: './admin-upgrade-requests.component.scss'
})
export class AdminUpgradeRequestsComponent implements OnInit {

  upgradeRequests: UpgradeRequest[] = [];
  requests: any[] = [];

  constructor(private companyService: CompanyService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.companyService.getUpgradeRequests().subscribe((data: UpgradeRequest[]) => {
      this.upgradeRequests = data.filter(req => req.status === 'pending');
      console.log(this.upgradeRequests);
    });
    console.log(this.requests);
  }

  approveRequest(upgradeRequestId: number): void {
    this.companyService.approveUpgradeRequest(upgradeRequestId).subscribe(response => {
      this.upgradeRequests = this.upgradeRequests.filter(req => req.id !== upgradeRequestId);
      this.toastr.success('Demande validée');
    }, error => {
      console.error('Erreur lors de la validation de la requête :', error);
      this.toastr.error('Erreur lors de la validation');
    });
  }

  rejectRequest(upgradeRequestId: number): void {
    this.companyService.rejectUpgradeRequest(upgradeRequestId).subscribe(response => {
      this.upgradeRequests = this.upgradeRequests.filter(req => req.id !== upgradeRequestId);
      this.toastr.success('Demande rejetée');
    }, error => {
      console.error('Erreur lors du refus de la requête :', error);
      this.toastr.error('Erreur lors de la validation');
    });
  }

  getRoleLabel(roleId: number): string {
    switch (roleId) {
      case 3:
        return 'Collectivité';
      case 4:
        return 'Entreprise';
      default:
        return 'Rôle inconnu';
    }
  }

}
