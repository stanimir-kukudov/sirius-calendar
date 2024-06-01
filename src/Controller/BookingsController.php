<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Entity\User;
use App\Repository\BookingRepository;
use App\Repository\UserRepository;
use App\Requests\BookingRequest;
use App\Requests\CreateBookingRequest;
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
    public function createBooking(CreateBookingRequest $request, BookingRepository $bookingRepository, UserRepository $userRepository): JsonResponse
    {
        $reservationDate = $request->getReservationDate();
        $userInfo = $request->getUserInfo();
        $existingBooking = $bookingRepository->findOneByTime($reservationDate);

        if ($existingBooking) {
            $response = new JsonResponse(['message' => 'Booking already exist.'], 400);
            return $response->send();
        }

        $user = $userRepository->findOneBy(['email' => $userInfo['email']]);

        if (!$user) {
            $user = new User();
            $user->setFirstName($userInfo['firstName']);
            $user->setLastName($userInfo['lastName']);
            $user->setEmail($userInfo['email']);
            $user->setPhone($userInfo['phoneNumber']);
            $user->setCreatedAt(new \DateTime());
            $user->setUpdatedAt(new \DateTime());
            $userRepository->save($user);
        }

        $booking = new Booking();
        $dateTime = new \DateTime();
        $dateTime->setTimestamp($reservationDate->getTimestamp());
        $booking->setTime($dateTime);
        $booking->setUser($user);
        $booking->setCreatedAt(new \DateTime());
        $booking->setUpdatedAt(new \DateTime());
        $bookingRepository->save($booking, true);


        return $this->json($booking, 200, [], ['groups' => 'list_bookings']);
    }
}
