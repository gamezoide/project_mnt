<?php

namespace Admin\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Admin\UserBundle\Model\UserModel;

class UserController extends Controller {

    public function __construct() {
        $this->model = new UserModel();
    }

    public function indexAction() {

        return $this->render('AdminUserBundle:User:index.html.twig', array('users' => $this->model->Users()));
    }

    public function dataAction($id) {
        $user = array();
        if ($id > 0) {//exist
            $user = $this->model->getUser($id);
        }

        return $this->render('AdminUserBundle:User:data.html.twig', array('user' => $user));
    }

    public function saveAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        if ($post['id'] != '') {//exist
            $this->model->updateUser($post);
        } else {//new
            $this->model->insertUser($post);
        }

        return $this->redirect($this->generateUrl('admin_user_homepage'));
    }

    public function deleteAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        $delete = $this->model->deleteUser($post['id']);

        $result = Array("status" => true, "data" => Array("statusDelete" => $delete['status']));
        return new Response(json_encode($result), 200, Array('Content-Type', 'text/json'));
    }

}
