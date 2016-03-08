<?php

namespace Conexion\EstadosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Conexion\EstadosBundle\Model\EstadosModel;

class EstadosController extends Controller
{
    
    public function __construct() {
        $this->EstadosModel = new EstadosModel();
    }
    
    public function indexAction()
    {
        $args['id_pais']=1;
        $content['mx']['estados']=  $this->EstadosModel->getEstados($args);
        $args['id_pais']=2;
        $content['us']['estados']=  $this->EstadosModel->getEstados($args);
        
        return $this->render('ConexionEstadosBundle:Estados:index.html.twig', array('content' => $content));
    }
}
