<?php

namespace App\Requests;

use Symfony\Component\Validator\Constraints as Assert;

class CreateBookingRequest extends BaseRequest
{
    #[Assert\Type(\DateTimeImmutable::class)]
    #[Assert\NotBlank]
    #[Assert\Range(min: 'now')]
    protected ?\DateTimeImmutable $reservationDate = null;

    #[Assert\Collection(
        fields: [
            'firstName' => new Assert\Required(
                new Assert\NotBlank
            ),
            'lastName' => new Assert\Required(
                new Assert\NotBlank
            ),
            'email' => new Assert\Required([
                new Assert\NotBlank,
                new Assert\Email,
            ]),
            'phoneNumber' => new Assert\Required([
                new Assert\NotBlank,
                new Assert\Regex('/^\d+$/'),
            ]),
        ],
    )]
    protected array $userInfo = [];

    public function getReservationDate(): \DateTimeImmutable
    {
        return $this->reservationDate;
    }

    /**
     * @return array{
     *     firstName: string,
     *     lastName: string,
     *     email: string,
     *     phoneNumber: string
     * }
     */
    public function getUserInfo(): array
    {
        return $this->userInfo;
    }
}