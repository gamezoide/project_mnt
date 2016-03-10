<?php

namespace Admin\ProjectUserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Admin\UserBundle\Model\UserModel;
use Admin\ProjectBundle\Model\ProjectModel;
use Admin\ProjectUserBundle\Model\ProjectUserModel;

class ProjectUserController extends Controller {

    public function __construct() {
        $this->umodel = new UserModel();
        $this->pmodel = new ProjectModel();
        $this->model = new ProjectUserModel();
    }

    public function indexAction() {

        $users = $this->umodel->Users();

        $projects = $this->model->getProjectsUsers();

        $project_user = array();
        foreach ($projects as $project) {
            if (!isset($project_user[$project['id']])) {
                $project_user[$project['id']] = $project;
                $project_user[$project['id']]['user'] = '';
                if (isset($users[$project['user']])) {
                    $project_user[$project['id']]['user'].= $users[$project['user']]['username'] . ',';
                }
            } else {
                if (isset($users[$project['user']])) {
                    $project_user[$project['id']]['user'].=$users[$project['user']]['username'] . ',';
                }
            }
        }
        
        foreach ($project_user as &$project) {
            $project['user'] = rtrim($project['user'], ",");
            $project['user'] = str_replace(",", ", ", $project['user']);
        }
        return $this->render('AdminProjectUserBundle:ProjectUser:index.html.twig', array('projects' => $project_user));
    }

    public function dataAction($id) {

        $project = $this->pmodel->getProject($id);

        $users = $this->umodel->Users();

        $project_user = $this->model->getProjectUsers($id);

        return $this->render('AdminProjectUserBundle:ProjectUser:data.html.twig', array('project' => $project, 'users' => $users, 'project_user' => $project_user));
    }

    public function addAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        $this->model->insertProjectUser($post);

        $result = Array("status" => true);
        return new Response(json_encode($result), 200, Array('Content-Type', 'text/json'));
    }

    public function deleteAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        $delete = $this->model->deleteProjectUser($post);

        $result = Array("status" => true, "data" => Array("statusDelete" => $delete['status']));
        return new Response(json_encode($result), 200, Array('Content-Type', 'text/json'));
    }

}
