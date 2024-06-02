<?php

namespace App\Service;

use App\Entity\Booking;
use App\Entity\User;
use App\Repository\BookingRepository;
use App\Repository\UserRepository;
use App\Requests\CreateBookingRequest;

class BookingCreateService
{
    /**
     * @param CreateBookingRequest $request
     * @return Booking
     * @throws \Exception
     */
    public function create(CreateBookingRequest $request, BookingRepository $bookingRepository, UserRepository $userRepository): Booking
    {
        $reservationDate = $request->getReservationDate();
        $userInfo = $request->getUserInfo();

        $existingBooking = $bookingRepository->findOneByTime($reservationDate);

        if ($existingBooking) {
            throw new \Exception('Booking already exist.');
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

        return $booking;
    }
}