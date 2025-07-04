import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './dynamic-table.component.html',
})
export class DynamicTableComponent {
  @Input() columns: { field: string; header: string }[] = [];
  @Input() data: any[] = [];
  @Input() actions: string[] = [];
  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();
  @Output() rowClicked = new EventEmitter<any>();

  onRowClick(row: any) {
    this.rowClicked.emit(row);
  }
  onAction(action: string, row: any) {
    this.actionClicked.emit({ action, row });
  }

   getActionIcon(action: string): string {
    const icons: { [key: string]: string } = {
      'Edit': 'pi pi-pencil',
      'Delete': 'pi pi-trash',
      'View': 'pi pi-eye',
      'Download': 'pi pi-download',
      'Print': 'pi pi-print',
      'Receive': 'pi pi-check',
      'Reject': 'pi pi-times'
    };
    return icons[action] || '';
  }

  getActionButtonClass(action: string): string {
    const classes: { [key: string]: string } = {
      'Edit': 'p-button-info',
      'Delete': 'p-button-danger',
      'View': 'p-button-success',
      'Download': 'p-button-help',
      'Print': 'p-button-warning',
      'Receive': 'p-button-success',
      'Reject': 'p-button-danger'
    };
    return classes[action] || 'p-button-secondary';
  }
}


