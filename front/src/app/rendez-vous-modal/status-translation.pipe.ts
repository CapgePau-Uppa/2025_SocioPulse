import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'statusTranslation'
})
export class StatusTranslationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value?.toLowerCase()) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      default:
        return value;
    }
  }
}
