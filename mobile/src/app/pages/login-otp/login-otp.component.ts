import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SweetAlertService } from '../../utility/sweet-alert.service';
import { debug } from '../../utility/function';

@Component({
  selector: 'app-login-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss'],
})
export class LoginOtpComponent implements OnInit {
  otpDigits: string[] = ['', '', '', '', '', '']; // 6-digit OTP
  errorMessage: string = '';
  loading: boolean = false;
  otp_id: string | null = null;

  cooldown: number = 0; // seconds remaining
  cooldownDuration: number = 30; // change this to any seconds you want
  cooldownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private alert: SweetAlertService,
    private router: Router
) {}

    ngOnInit() {
        this.startCooldown();
        this.otp_id = this.route.snapshot.paramMap.get('OTPid');

        // Optional: Focus first field
        setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) (firstInput as HTMLInputElement).focus();
        });
  }

  get isOtpIncomplete(): boolean {
    return this.otpDigits.some(d => !d);
  }

  onOtpChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpDigits[index] = value;

    // Move to next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  }

  async submitOtp() {
    if (this.isOtpIncomplete) {
      this.errorMessage = 'Please enter all 6 digits of OTP.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const fullOtp = this.otpDigits.join('');

   if (this.otp_id) {
    await firstValueFrom(this.service.loginOTPVerify({ otp_id: this.otp_id, otp: fullOtp }).pipe(
       tap(
         (response) => {
             debug(response);
             if (response.status == 200 && response.body.token) {
                 localStorage.setItem('token', response.body.token);
                 this.router.navigate(['/']);
             }
         },
         (error) => {
           this.alert.errorAlert(error.error.message, error.error.body);
         }
       )
    ));
   }
  }

  resendOtp(): void {
    if (this.cooldown > 0) return;
    this.otpDigits = ['', '', '', '', '', ''];
    this.errorMessage = '';
    this.startCooldown();
  }

  startCooldown(): void {
    this.cooldown = this.cooldownDuration;
    clearInterval(this.cooldownInterval);

    this.cooldownInterval = setInterval(() => {
      this.cooldown -= 1;
      if (this.cooldown <= 0) {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }
}
