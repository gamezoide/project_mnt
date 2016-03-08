<?php

namespace Admin\WelcomeBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WelcomeController extends Controller
{
    public function indexAction()
    {
        return $this->render('AdminWelcomeBundle:Welcome:index.html.twig', array());
    }
}
