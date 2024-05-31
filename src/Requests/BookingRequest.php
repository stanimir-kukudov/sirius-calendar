<?php

namespace App\Requests;

use Symfony\Component\Validator\Constraints as Assert;

class BookingRequest extends BaseRequest
{
    #[Assert\Type(\DateTimeImmutable::class)]
    #[Assert\NotBlank]
    #[Assert\Range(min: 'now')]
    protected ?\DateTimeImmutable $time = null;

    public function getTime(): \DateTimeImmutable
    {
        return $this->time;
    }
}