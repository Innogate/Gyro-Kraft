import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CutterNameService } from '../../../services/cutterName.service';
import { firstValueFrom } from 'rxjs';
import { CutterName } from '../../../services/interface/cutter-name';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlertService } from '../../../utility/sweet-alert.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-cutter-name',
    imports: [CommonModule, FormsModule, DialogModule, ReactiveFormsModule, DropdownModule],
    templateUrl: './cutter-name.component.html',
    styleUrls: ['./cutter-name.component.scss']
})
export class CutterNameComponent {
    cutters: CutterName[] = [];

    constructor(
        private cutterNameService: CutterNameService,
        private fb: FormBuilder,
        private sweetAlertService: SweetAlertService
    ) {}

    showForm = false;
    showEdit = false;
    newCutter: CutterName = { name: '', address: '', phone_no: '', jobber_type: '', gst_no: '', srcore: 0 };
    errorMessage: string = '';
    cutterForm!: FormGroup;

    toggleForm() {
        this.showEdit = false;
        this.showForm = !this.showForm;
        if (this.showForm) {
            this.cutterForm.reset();
        }
    }

    ngOnInit() {
        this.cutterForm = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            address: [''],
            phone_no: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            jobber_type: ['', Validators.required],
            gst_no: ['', [Validators.maxLength(15)]],
            srcore: [null, [Validators.min(0), Validators.max(100)]]
        });

        this.gateAllCutter();
    }

    typeOptions = [
        { label: 'Cutter', value: 'Cutter' },
        { label: 'Printer', value: 'Printer' },
        { label: 'Stitching', value: 'Stitching' },
        { label: 'Button', value: 'Button' },
        { label: 'Finishing', value: 'Finishing' },
        { label: 'Packing', value: 'Packing' }
    ];

    // gate all cutter
    async gateAllCutter() {
        try {
            const response = await firstValueFrom(this.cutterNameService.gateAllCutter());
            if (response.status === 200 && Array.isArray(response.body)) {
                this.cutters = response.body;
            }
        } catch (e) {
            console.error('Error fetching cutters:', e);
        }
    }

    // add cutter
    addCutter() {
        if (this.cutterForm.valid) {
            this.newCutter = {
                ...this.cutterForm.value,
                jobber_type: this.cutterForm.value.jobber_type?.value || ''
            };

            try {
                firstValueFrom(this.cutterNameService.createCutter(this.newCutter)).then((response) => {
                    if (response.status === 200) {
                        this.sweetAlertService.successAlert('Success', 'Cutter created successfully');
                        this.gateAllCutter();
                        this.toggleForm();
                    } else {
                        this.sweetAlertService.errorAlert('Error', 'Failed to create cutter');
                    }
                });
            } catch (e) {
                this.sweetAlertService.errorAlert('Error', 'Failed to create cutter');
            }
        } else {
            this.sweetAlertService.warningAlert('Worning', 'Please fill in all required fields correctly.');
        }
    }

    // View cutter
    editCutter(cutter: CutterName) {
        this.newCutter = cutter;

        const selectedType = this.typeOptions.find((option) => option.value === cutter.jobber_type);

        this.cutterForm.patchValue({
            id: cutter.id,
            name: cutter.name,
            address: cutter.address,
            phone_no: Number(cutter.phone_no),
            jobber_type: selectedType || null,
            gst_no: cutter.gst_no,
            srcore: cutter.srcore
        });

        this.showEdit = true;
        this.showForm = true;
    }

    // Update cutter
    updateCutter() {
        console.log(this.cutterForm.value);
        if (this.cutterForm.valid) {
            this.newCutter = {
                ...this.cutterForm.value,
                jobber_type: this.cutterForm.value.jobber_type?.value || ''
            };

            try {
                firstValueFrom(this.cutterNameService.updateCutter(this.newCutter)).then((response) => {
                    if (response.status === 200) {
                        this.sweetAlertService.successAlert('Success', 'Cutter updated successfully');
                        this.gateAllCutter();
                        this.toggleForm();
                    } else {
                        this.sweetAlertService.errorAlert('Error', 'Failed to update cutter');
                    }
                });
            } catch (e) {
                this.sweetAlertService.errorAlert('Error', 'Failed to update cutter');
            }
        } else {
            this.sweetAlertService.warningAlert('Worning', 'Please fill in all required fields correctly.');
        }
    }

    // Delete cutter
    deleteCutter(cutter: CutterName) {
        const newStatus = !cutter.status;
        const action = newStatus ? 'activate' : 'deactivate';

        const payload = {
            id: cutter.id,
            status: !cutter.status
        } as unknown as CutterName;

        this.sweetAlertService.confirmAlert('Confirmation', `Are you sure you want to ${action} this cutter?`).then((result) => {
            if (result.isConfirmed) {
                firstValueFrom(this.cutterNameService.deleteCutter(payload)).then((response) => {
                    if (response.status === 200) {
                        this.sweetAlertService.successAlert('Success', `Cutter ${action}d successfully`);
                        this.gateAllCutter();
                    } else {
                        this.sweetAlertService.errorAlert('Error', `Failed to ${action} cutter`);
                    }
                });
            }
        });
    }
}
