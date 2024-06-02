<?php

namespace App\Controller;

use App\Repository\BookingRepository;
use App\Repository\UserRepository;
use App\Requests\BookingRequest;
use App\Requests\CreateBookingRequest;
use App\Service\BookingCreateService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class BookingsController extends AbstractController
{
    #[Route('/bookings', format: 'json', methods: ['GET'])]
    public function bookings(BookingRequest $request, BookingRepository $bookingRepository, SerializerInterface $serializer): JsonResponse
    {
        $time = $request->getTime();

        $month = $time->format('m');
        $year = $time->format('Y');

        return $this->json($bookingRepository->findCurrentMonthBookings($month, $year), 200, [], ['groups' => 'list_bookings']);
    }

    #[Route('/bookings', format: 'json', methods: ['POST'])]
    public function createBooking(CreateBookingRequest $request, BookingRepository $bookingRepository, UserRepository $userRepository, BookingCreateService $bookingCreateService): JsonResponse
    {
        try {
            $booking = $bookingCreateService->create($request, $bookingRepository, $userRepository);
        } catch (\Exception $e) {
            $response = new JsonResponse(['message' => $e->getMessage()], 400);

            return $response->send();
        }

        return $this->json($booking, 200, [], ['groups' => 'list_bookings']);
    }
}
