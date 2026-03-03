<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\ClassEnrollment;
use App\Models\Payment;
use App\Services\PaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use ApiResponse;

    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Store a newly created payment
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $enrollment = ClassEnrollment::with('class')->findOrFail($request->enrollment_id);

        // Verificar que el usuario sea el dueño de la inscripción
        if ($enrollment->student_id !== $request->user()->id) {
            return $this->error('No tienes permiso para pagar esta inscripción', 403);
        }

        // Verificar que no esté ya pagada
        if ($enrollment->payment_status === 'paid') {
            return $this->error('Esta inscripción ya está pagada', 400);
        }

        $payment = $this->paymentService->processPayment(
            $enrollment,
            $request->payment_method,
            $request->transaction_id
        );

        return $this->success(
            new PaymentResource($payment->load('enrollment.class')),
            'Pago procesado exitosamente',
            201
        );
    }

    /**
     * Display the specified payment
     */
    public function show(Request $request, Payment $payment): JsonResponse
    {
        $enrollment = $payment->enrollment;

        // Verificar permisos
        if ($enrollment->student_id !== $request->user()->id && 
            $enrollment->class->coach_id !== $request->user()->id) {
            return $this->error('No tienes permiso para ver este pago', 403);
        }

        return $this->success(new PaymentResource($payment->load('enrollment.class')));
    }

    /**
     * Confirm a payment (webhook simulation)
     */
    public function confirm(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->status === 'completed') {
            return $this->error('Este pago ya está confirmado', 400);
        }

        $this->paymentService->confirmPayment($payment);

        return $this->success(
            new PaymentResource($payment->load('enrollment.class')),
            'Pago confirmado exitosamente'
        );
    }
}
