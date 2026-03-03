<?php

namespace App\Services;

use App\Models\ClassEnrollment;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Process a payment for an enrollment
     */
    public function processPayment(
        ClassEnrollment $enrollment, 
        string $paymentMethod, 
        ?string $transactionId = null
    ): Payment {
        return DB::transaction(function () use ($enrollment, $paymentMethod, $transactionId) {
            $payment = Payment::create([
                'enrollment_id' => $enrollment->id,
                'amount' => $enrollment->class->price,
                'currency' => 'USD',
                'payment_method' => $paymentMethod,
                'transaction_id' => $transactionId ?? $this->generateTransactionId(),
                'status' => 'pending',
            ]);

            // Simular procesamiento exitoso (en producción, integrar con payment gateway)
            $this->simulatePaymentProcessing($payment);

            return $payment;
        });
    }

    /**
     * Confirm a payment
     */
    public function confirmPayment(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'completed',
                'paid_at' => now(),
            ]);

            $payment->enrollment->update([
                'payment_status' => 'paid',
            ]);
        });
    }

    /**
     * Refund a payment
     */
    public function refundPayment(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'refunded',
            ]);

            $payment->enrollment->update([
                'payment_status' => 'refunded',
            ]);
        });
    }

    /**
     * Simulate payment processing (replace with real gateway integration)
     */
    private function simulatePaymentProcessing(Payment $payment): void
    {
        // Simular un procesamiento exitoso inmediato
        // En producción, esto sería una llamada a Stripe, PayPal, etc.
        $this->confirmPayment($payment);
    }

    /**
     * Generate a unique transaction ID
     */
    private function generateTransactionId(): string
    {
        return 'TXN-' . strtoupper(uniqid()) . '-' . now()->timestamp;
    }
}
