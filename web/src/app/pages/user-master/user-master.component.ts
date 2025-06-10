import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { firstValueFrom, tap } from 'rxjs';
import { allUsersResponse } from '../../services/interface/user';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PermissionService } from '../../services/permission.service';



@Component({
    selector: 'app-user-master',
    imports: [
        DialogModule,
        InputSwitchModule,
        CardModule,
        ButtonModule,
        CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        DropdownModule,
        ToggleButtonModule,
        InputTextModule,
        InputGroupModule,
        CheckboxModule,
        SidebarModule

    ],
    templateUrl: './user-master.component.html',
    styleUrl: './user-master.component.scss'
})
export class UserMasterComponent implements OnInit {
    users?: any;
    hoveredRow = -1;

    checked: boolean = true;

    showCreateUserDialog = false;
    userForm: FormGroup;
    previewUrl: string | ArrayBuffer | null = null;
    sameWhatsappControl = new FormControl(false);
    isEnabled: boolean = true;
    user_disable = 0;
    update_mode = false;
    user_id = 0;

    visibleSidebar: boolean = false;

    roleOptions = [
        { label: 'Manager', value: 'Manager' },
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'Normal user', value: ' Normal user' }

    ];

    userGroups = [
        { label: 'Consultant', value: 'Consultant' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Manager', value: 'Manager' }
    ];

    selectedGroup = 'Consultant';
    permissions?: any;
    permissions_sleeted_user?: any;

    constructor(
        private service: UserService,
        private alert: SweetAlertService,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private permissionService: PermissionService
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            whatsapp: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: [''],
            role: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: [''],
            profileImage: [''],
        }, { validators: this.passwordMatchValidator });
    }


    toggle() {
        this.isEnabled = !this.isEnabled;
        this.user_disable = this.isEnabled ? 0 : 1;

        this.userForm.patchValue({
            disabled: this.user_disable
        });
    }

    async saveChanges() {
        this.permissions = this.permissions.map((perm: { id: number; can_add: boolean; can_edit: boolean; can_delete: boolean }) => {
            const { id, can_add, can_edit, can_delete } = perm;
            return { id, can_add, can_edit, can_delete };
        });
        this.visibleSidebar = false;
        await firstValueFrom(this.permissionService.updatePermission(this.permissions).pipe(
            tap(
                (response) => {
                    if (response.status == 200) {
                        this.alert.successAlert(response.body.message, response.body.body);
                    }
                },
                (error) => {
                    this.alert.errorAlert(error.error.message, error.error.body);
                }
            )
        ))
    }

    async ngOnInit() {
        await firstValueFrom(this.service.getAllUsers({
            max: 100,
            current: 0
        }).pipe(
            tap(
                (response) => {
                    if (response.status == 200) {
                        this.users = response.body.users;
                    }
                },
                (error) => {
                    this.alert.errorAlert(error.error.message, error.error.body);
                }
            )
        ))
        this.getAllModulesList();
        this.route.queryParams.subscribe(params => {
            if (params['user_data']) {
                const user = JSON.parse(params['user_data']);
                this.user_id = user.id;
                this.userForm.patchValue({
                    name: user.name,
                    phone: user.phone_no,
                    whatsapp: user.whatsapp_no,
                    email: user.email,
                    address: user.address,
                    role: user.role
                });
                // set image
                if (user.photo) {
                    this.previewUrl = `data:image/jpeg;base64,${user.photo}`;
                } else {
                    this.previewUrl = '/img/profile.png'
                }
                this.update_mode = true;
                // remove password and confirm password fields required validators
                this.userForm.get('password')?.clearValidators();
                this.userForm.get('password')?.updateValueAndValidity();
                this.userForm.get('confirmPassword')?.clearValidators();
                this.userForm.get('confirmPassword')?.updateValueAndValidity();

            }
        });
    }




    getRoleColor(role: string): string {
        switch (role.toLowerCase()) {
            case 'admin':
                return '#ef4444'; // red
            case 'manager':
                return '#f59e0b'; // amber
            case 'user':
                return '#3b82f6'; // blue
            default:
                return '#6b7280'; // gray
        }
    }


    // Custom validator to ensure password and confirmPassword match
    passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.previewUrl = reader.result;
                // also add bas
                const base64String = (reader.result as string);
                this.userForm.patchValue({
                    profileImage: base64String
                })
            };

            reader.readAsDataURL(file);
        }
    }

    // Function to handle the checkbox for "same as phone"
    onCheckboxChange(event: CheckboxChangeEvent): void {
        const isChecked = event.checked; // Get whether the checkbox is checked or not

        // Set the value of sameWhatsappControl (checkbox control)
        this.sameWhatsappControl.setValue(isChecked);

        // If the checkbox is checked, copy the phone number to the WhatsApp field
        if (isChecked) {
            const phone = this.userForm.get('phone')?.value;  // Get the phone number from the form
            this.userForm.get('whatsapp')?.setValue(phone);  // Set the WhatsApp number to the phone number
        } else {
            this.userForm.get('whatsapp')?.setValue('');  // Clear the WhatsApp number if unchecked
        }
    }


    async submit() {

        if (!this.update_mode) {
            if (this.userForm.valid) {
                await firstValueFrom(this.service.createUser({
                    name: this.userForm.get('name')?.value,
                    address: this.userForm.get('address')?.value,
                    phone_no: this.userForm.get('phone')?.value,
                    whatsapp_no: this.userForm.get('whatsapp')?.value,
                    email: this.userForm.get('email')?.value,
                    photo: this.userForm.get('profileImage')?.value,
                    password_hash: this.userForm.get('password')?.value,
                    role: this.userForm.get('role')?.value
                }).pipe(
                    tap(
                        (response) => {
                            if (response.status == 200) {
                                this.alert.successAlert('Success', 'User created successfully.');
                            }
                        },
                        (error) => {
                            this.alert.errorAlert(error.error.message, error.error.body);
                        }
                    )
                ));
            } else {
                this.alert.errorAlert('Error', 'Please fill in all the required fields.');
            }
        } else {
            await firstValueFrom(this.service.updateUser(
                {
                    id: this.user_id,
                    name: this.userForm.get('name')?.value,
                    address: this.userForm.get('address')?.value,
                    phone_no: this.userForm.get('phone')?.value,
                    whatsapp_no: this.userForm.get('whatsapp')?.value,
                    email: this.userForm.get('email')?.value,
                    photo: this.userForm.get('profileImage')?.value,
                    password_hash: this.userForm.get('password')?.value,
                    disabled: this.user_disable,
                    role: this.userForm.get('role')?.value
                }
            ).pipe(
                tap(
                    (response) => {
                        if (response.status == 200) {
                            this.alert.successAlert('Success', 'User updated successfully.');
                        }
                    },
                    (error) => {
                        this.alert.errorAlert(error.error.message, error.error.body);
                    }
                )
            ));
        }

        this.ngOnInit();
    }

    updateUser(user: any) {
        this.update_mode = true;
        this.showCreateUserDialog = true;
        this.user_id = user.id;
        this.userForm.patchValue({
            name: user.name,
            phone: user.phone_no,
            whatsapp: user.whatsapp_no,
            email: user.email,
            address: user.address,
            role: user.role
        });
    }

    async permit(user: any) {
        await firstValueFrom(this.permissionService.getById({
            "user_id": user.id
        }).pipe(
            tap(
                (response) => {
                    if (response.status == 200) {
                        this.permissions.forEach((module: any) => {
                            module.can_add = false;
                            module.can_edit = false;
                            module.can_delete = false;
                            response.body.forEach((permission: any) => {
                                if (module.id == permission.module_id) {
                                    module.can_add = (permission.can_add == 1);
                                    module.can_edit = (permission.can_edit == 1);
                                    module.can_delete = (permission.can_delete == 1);
                                }
                            })
                        });
                    }
                },
                (error) => {
                    this.alert.errorAlert(error.error.message, error.error.body);
                }
            )
        ))
        this.visibleSidebar = true;
        this.permissions_sleeted_user = user;
    }

    updateUserByPermissions(user: any) {
        this.updateUser(user);
    }

    async getAllModulesList() {
        await firstValueFrom(this.permissionService.getModuleList().pipe(
            tap(
                (response) => {
                    if (response.status == 200) {
                        this.permissions = response.body;
                        this.permissions.forEach((module: any) => {
                            module.can_add = false;
                            module.can_edit = false;
                            module.can_delete = false;
                        })
                    }
                },
                (error) => {
                    this.alert.errorAlert(error.error.message, error.error.body);
                }
            )
        ))
    }
}
