import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Production Process',
                items: [
                    {
                        label: 'Users Master',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Users',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/pages/user-master']
                            },
                            {
                                label: 'Create User',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/pages/create-user']
                            }

                        ]
                    },
                    {
                        label: 'Masters',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Age Group',
                                icon: 'pi pi-fw pi-sliders-h',
                                routerLink: ['/masters/age-group']
                            },
                            {
                                label: 'Cutter Name',
                                icon: 'pi pi-fw pi-cut',
                                items: [
                                    { label: 'Name', icon: 'pi pi-fw pi-id-card' },
                                    { label: 'Address', icon: 'pi pi-fw pi-map-marker' },
                                    { label: 'Phone No', icon: 'pi pi-fw pi-phone' },
                                    { label: 'Whatsapp No', icon: 'pi pi-fw pi-whatsapp' }
                                ]
                            },
                            {
                                label: 'Printer Master',
                                icon: 'pi pi-fw pi-print',
                                items: [
                                    { label: 'Name', icon: 'pi pi-fw pi-id-card' },
                                    { label: 'Address', icon: 'pi pi-fw pi-map-marker' },
                                    { label: 'Phone No', icon: 'pi pi-fw pi-phone' },
                                    { label: 'Whatsapp No', icon: 'pi pi-fw pi-whatsapp' }
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Order Sheet',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/order-sheet']
                    },
                    {
                        label: 'Cutting',
                        icon: 'pi pi-fw pi-hammer',
                        routerLink: ['/cutting']
                    },
                    {
                        label: 'Print',
                        icon: 'pi pi-fw pi-print',
                        routerLink: ['/print']
                    },
                    {
                        label: 'Stitch',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/stitch']
                    },
                    {
                        label: 'Button',
                        icon: 'pi pi-fw pi-bullseye',
                        routerLink: ['/button']
                    },
                    {
                        label: 'Finishing',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/finishing']
                    },
                    {
                        label: 'Packing',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/packing']
                    },
                    {
                        label: 'Reports',
                        icon: 'pi pi-fw pi-chart-line',
                        items: [
                            {
                                label: 'BOM',
                                icon: 'pi pi-fw pi-clipboard',
                                routerLink: ['/reports/bom']
                            },
                            {
                                label: 'Search as per Production Stage',
                                icon: 'pi pi-fw pi-search',
                                routerLink: ['/reports/search']
                            },
                            {
                                label: 'Download as Excel',
                                icon: 'pi pi-fw pi-file-excel',
                                routerLink: ['/reports/download']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Other Features',
                items: [
                    {
                        label: 'Notifications',
                        icon: 'pi pi-fw pi-bell',
                        routerLink: ['/notifications']
                    },
                    {
                        label: 'WhatsApp Reminders',
                        icon: 'pi pi-fw pi-whatsapp',
                        routerLink: ['/whatsapp-reminders']
                    },
                    {
                        label: 'Software Platform',
                        icon: 'pi pi-fw pi-cloud',
                        items: [
                            { label: 'Web Version', icon: 'pi pi-fw pi-globe', routerLink: ['/web-version'] },
                            { label: 'Android App', icon: 'pi pi-fw pi-mobile', routerLink: ['/android-app'] }
                        ]
                    }
                ]
            },
            {
                label: 'Action',
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        routerLink: ['/logout']
                    }
                ]
            }

        ];

    }
}
