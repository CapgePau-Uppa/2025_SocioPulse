import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../services/company.service';


interface Company {
  id: number;
  siren: string;
  nom: string;
  type_entreprise: 'TPE/PME' | 'GE' | 'ETI' | 'Association' | 'Organisme de recherche' |
                   'EPIC' | 'Etablissement public' | 'GIE' | 'Organisme de formation' | 'Autre';
  note_generale?: number | null;
  note_citoyenne?: number | null;
  note_commune?: number | null;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-upgrade-dialog',
  imports: [
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './upgrade-dialog.component.html',
  styleUrl: './upgrade-dialog.component.scss'
})

export class UpgradeDialogComponent {
  selectedType: string = '';
  department: string = '';
  city: string = '';
  enterpriseSelection: string = '';
  selectedCompany: any = '';
  newCompanyName: string = '';
  newCompanySiren: string = '';
  newCompanyType: string = '';

  companies: Company[] = [];

  companyTypes = [
    'TPE/PME', 'GE', 'ETI', 'Association', 'Organisme de recherche',
    'EPIC', 'Etablissement public', 'GIE', 'Organisme de formation', 'Autre'
  ];

  constructor(
    public dialogRef: MatDialogRef<UpgradeDialogComponent>,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.companyService.getCompanies().subscribe(data => {
      this.companies = data;
    });
  }

  confirmUpgrade(): void {
    let details: any = {};

    if (this.selectedType === 'collectivity') {
      details = { department: this.department, city: this.city };
    } else if (this.selectedType === 'enterprise') {
      if (this.enterpriseSelection === 'new') {
        details = {
          nom: this.newCompanyName,
          siren: this.newCompanySiren,
          type_entreprise: this.newCompanyType
        };
      } else if (this.enterpriseSelection === 'existing') {
        details = {
          entreprise_id: this.selectedCompany.id,
        };
      }
    }

    this.dialogRef.close({ type: this.selectedType, details });
  }
}
