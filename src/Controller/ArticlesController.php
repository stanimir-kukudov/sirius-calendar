<?php

namespace App\Controller;

use App\Repository\BookingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ArticlesController extends AbstractController
{
    protected BookingRepository $repositoryService;

    public function __construct(BookingRepository $repositoryService)
    {
        $this->repositoryService = $repositoryService;
    }

    #[Route(path: '/articles', name: 'articles', methods: ['GET'])]
    public function list(): Response
    {
        echo '<pre>';
        var_dump($this->repositoryService->findAll());
        echo '</pre>';
        die();
        return new Response('Welcome to Latte and Code ');
    }
}
