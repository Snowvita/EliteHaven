import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  bookingId: number = 0;
  amount: number = 0;
  selectedPaymentMethod: string = 'CREDIT_CARD';
  isProcessing: boolean = false;
  paymentSuccess: boolean = false;
  errorMessage: string = '';

  paymentMethods = [
    { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
    { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
    { value: 'WALLET', label: 'Digital Wallet', icon: '👛' },
  ];

  constructor(private router: Router, private paymentService: PaymentService) {
    // Get navigation state in CONSTRUCTOR
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.bookingId = navigation.extras.state['bookingId'];
      this.amount = navigation.extras.state['amount'];
      console.log('Got payment data from navigation state in constructor');
    }
  }

  ngOnInit(): void {
    console.log('PaymentForm ngOnInit started');

    // If we didn't get data from navigation, check localStorage
    if (!this.bookingId || !this.amount) {
      const paymentIntentStr = localStorage.getItem('paymentIntent');
      console.log(
        'Retrieved paymentIntent from localStorage:',
        paymentIntentStr
      );

      if (paymentIntentStr) {
        const paymentIntent = JSON.parse(paymentIntentStr);
        this.bookingId = paymentIntent.bookingId;
        this.amount = paymentIntent.amount;
        localStorage.removeItem('paymentIntent');
        console.log('Got payment data from localStorage');
      }
    }

    console.log('Booking ID:', this.bookingId);
    console.log('Amount:', this.amount);

    if (!this.bookingId || !this.amount) {
      alert('Invalid payment details');
      this.router.navigate(['/']);
      return;
    }
  }

  processPayment(): void {
    this.isProcessing = true;
    this.errorMessage = '';

    const paymentData = {
      bookingId: this.bookingId,
      amount: this.amount,
      paymentMethod: this.selectedPaymentMethod,
    };

    console.log('Processing payment:', paymentData);

    // Mock payment with 2-second delay to simulate processing
    setTimeout(() => {
      this.paymentService.processPayment(paymentData).subscribe({
        next: (response) => {
          console.log('Payment successful:', response);
          this.paymentSuccess = true;
          this.isProcessing = false;

          // Redirect after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/my-bookings']);
          }, 2000);
        },
        error: (error) => {
          console.error('Payment failed:', error);
          this.errorMessage =
            error.error?.message || 'Payment failed. Please try again.';
          this.isProcessing = false;
        },
      });
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
