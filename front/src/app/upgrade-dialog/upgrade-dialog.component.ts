import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-upgrade-dialog',
  imports: [
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './upgrade-dialog.component.html',
  styleUrl: './upgrade-dialog.component.scss'
})
export class UpgradeDialogComponent {
  selectedType: string = '';
  department: string = '';
  city: string = '';
  enterpriseSelection: string = ''; // "existing" ou "new"
  selectedCompany: string = '';
  newCompanyName: string = '';
  newCompanySiren: string = '';
  newCompanyType: string = '';

  companies = ['Entreprise A', 'Entreprise B', 'Entreprise C'];
  companyTypes = [
    'TPE/PME', 'GE', 'ETI', 'Association', 'Organisme de recherche',
    'EPIC', 'Etablissement public', 'GIE', 'Organisme de formation', 'Autre'
  ];

  constructor(public dialogRef: MatDialogRef<UpgradeDialogComponent>) {}

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
        details = { nom: this.selectedCompany };
      }
    }

    this.dialogRef.close({ type: this.selectedType, details });
  }
}
