<?php

namespace App\Controller;

use App\Repository\BookingRepository;
use App\Requests\BookingRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class BookingsController extends AbstractController
{
    #[Route('/bookings', name: 'app_bookings', format: 'json')]
    public function bookings(BookingRequest $request, BookingRepository $bookingRepository): JsonResponse
    {
        $time = $request->getTime();

        $month = $time->format('m');
        $year = $time->format('Y');

        return $this->json($bookingRepository->findCurrentMonthBookings($month, $year));
    }
}
