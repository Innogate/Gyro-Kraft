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
}
