import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-6">Oops! The page you are looking for doesn't exist.</p>
      <div class="flex justify-center">
        <button
          class="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
          routerLink="/">
          Go Back to Home
        </button>
      </div>
    </div>
  </div>
  `
})
export class Notfound {}
