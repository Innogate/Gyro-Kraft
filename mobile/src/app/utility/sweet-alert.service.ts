import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  // Basic Alert
  basicAlert(message: string) {
    Swal.fire(message);
  }

  // Success Alert
  successAlert(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text
    });
  }

  // Error Alert
  errorAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    });
  }

  // Warning Alert
  warningAlert(title: string, text: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text
    });
  }

  // Info Alert
  infoAlert(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: text
    });
  }

  // Question Alert
  questionAlert(title: string, text: string) {
    Swal.fire({
      icon: 'question',
      title: title,
      text: text
    });
  }

  // Confirm Alert (OK/Cancel)
  confirmAlert(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });
  }

  // Input Alert
  inputAlert(title: string, placeholder: string) {
    return Swal.fire({
      title: title,
      input: 'text',
      inputLabel: 'Your input',
      inputPlaceholder: placeholder,
      showCancelButton: true
    });
  }

  // Loading Alert
  loadingAlert(title: string) {
    return Swal.fire({
      title: title,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false
    });
  }

  // Toast Alert
  toastAlert(title: string, text: string) {
    Swal.fire({
      toast: true,
      icon: 'success',
      title: title,
      text: text,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }
}

// export class ExampleComponent {

//     constructor(private sweetAlertService: SweetAlertService) { }

//     showSuccess() {
//       this.sweetAlertService.successAlert('Success!', 'Your action was successful!');
//     }

//     showConfirm() {
//       this.sweetAlertService.confirmAlert('Are you sure?', 'This action cannot be undone.')
//         .then(result => {
//           if (result.isConfirmed) {
//             this.sweetAlertService.successAlert('Confirmed', 'Your action was confirmed.');
//           } else {
//             this.sweetAlertService.errorAlert('Cancelled', 'Action was cancelled.');
//           }
//         });
//     }
//   }
