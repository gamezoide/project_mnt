<?php

namespace Admin\ProjectUserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('AdminProjectUserBundle:Default:index.html.twig', array('name' => $name));
    }
}
