<?php

namespace Admin\ProjectBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('AdminProjectBundle:Default:index.html.twig', array('name' => $name));
    }
}
