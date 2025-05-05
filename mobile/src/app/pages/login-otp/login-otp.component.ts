import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-otp',
  imports: [CommonModule, InputTextModule, FormsModule],
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss'],
  standalone: true
})
export class LoginOtpComponent {
  otpDigits: string[] = ['', '', '', '', '', '']; // 6 OTP digits
  errorMessage: string = '';
  loading: boolean = false;

  get isOtpIncomplete(): boolean {
    return this.otpDigits.some(d => !d);
  }

  // Handle OTP change
  onOtpChange(event: Event, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    if (/[^0-9]/.test(value)) {
      // Allow only numbers
      inputElement.value = '';
      return;
    }

    // Update OTP digits directly
    this.otpDigits[index] = value;

    // Move focus to next field when a value is entered
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  // Handle keydown events for the OTP input fields
  onKeyDown(event: KeyboardEvent, index: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !this.otpDigits[index]) {
      // Move focus to previous field if backspace is pressed and current field is empty
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    } else if (event.key !== 'Backspace' && inputElement.value.length === 1) {
      // Move focus to next field when current field is filled
      if (index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  }

  // Submit OTP
  submitOtp(): void {
    if (this.isOtpIncomplete) {
      this.errorMessage = 'Please enter all 6 digits of OTP.';
      return;
    }

    this.loading = true;
    // Simulate OTP verification
    setTimeout(() => {
      this.loading = false;
      alert('OTP verified successfully!');
    }, 2000);
  }
}
