<?php

namespace App\Repository;

use App\Entity\Booking;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 *
 * @method Booking|null find($id, $lockMode = null, $lockVersion = null)
 * @method Booking|null findOneBy(array $criteria, array $orderBy = null)
 * @method Booking[]    findAll()
 * @method Booking[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    /**
     * Find bookings for the current month.
     *
     * @return Booking[]
     */
    public function findCurrentMonthBookings(int $month, int $year): array
    {
        $start = new \DateTime("first day of $year-$month 00:00:00");
        $end = new \DateTime("last day of $year-$month 23:59:59");

        return $this->createQueryBuilder('e')
            ->andWhere('e.time BETWEEN :start AND :end')
            ->setParameter('start', $start)
            ->setParameter('end', $end)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param \DateTimeImmutable $time
     * @return Booking|null
     */
    public function findOneByTime(\DateTimeImmutable $time): ?Booking
    {
        return $this->createQueryBuilder('e')
            ->where('e.time = :time')
            ->setParameter('time', $time)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(Booking $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Booking $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
