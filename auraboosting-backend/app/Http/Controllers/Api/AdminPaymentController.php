<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    use ApiResponse;

    public function __construct(private PaymentService $paymentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with(['enrollment.class', 'enrollment.student'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->payment_method, fn($q) => $q->where('payment_method', $request->payment_method))
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginated($payments->setCollection(
            $payments->getCollection()->map(fn($payment) => new PaymentResource($payment))
        ));
    }

    public function show(Payment $payment): JsonResponse
    {
        return $this->success(new PaymentResource($payment->load(['enrollment.class', 'enrollment.student'])));
    }

    public function confirm(Payment $payment): JsonResponse
    {
        if ($payment->status === 'completed') {
            return $this->error('El pago ya está confirmado', 400);
        }

        $this->paymentService->confirmPayment($payment);

        return $this->success(new PaymentResource($payment->fresh()->load('enrollment.class')), 'Pago confirmado correctamente');
    }

    public function refund(Payment $payment): JsonResponse
    {
        if ($payment->status === 'refunded') {
            return $this->error('El pago ya fue reembolsado', 400);
        }

        $this->paymentService->refundPayment($payment);

        return $this->success(new PaymentResource($payment->fresh()->load('enrollment.class')), 'Pago reembolsado correctamente');
    }
}
