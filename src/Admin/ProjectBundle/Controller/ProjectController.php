<?php

namespace Admin\ProjectBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Admin\ProjectBundle\Model\ProjectModel;

class ProjectController extends Controller {

    public function __construct() {
        $this->model = new ProjectModel();
    }

    public function indexAction() {

        $projects = $this->model->Projects();

        foreach ($projects as &$project) {
            $project['deadline'] = $this->dateFormat($project['deadline']);
        }

        return $this->render('AdminProjectBundle:Project:index.html.twig', array('projects' => $projects));
    }

    public function dataAction($id) {
        $project = array();
        if ($id > 0) {//exist
            $project = $this->model->getProject($id);
            if ($project['deadline'] == '0000-00-00') {
                $project['deadline'] = '';
            }
        }

        return $this->render('AdminProjectBundle:Project:data.html.twig', array('project' => $project));
    }

    public function saveAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        if ($post['id'] != '') {//exist
            $this->model->updateProject($post);
        } else {//new
            $this->model->insertProject($post);
        }

        return $this->redirect($this->generateUrl('admin_project_homepage'));
    }

    public function deleteAction() {
        $request = $this->getRequest();
        $post = $request->request->all();

        $delete = $this->model->deleteProject($post['id']);

        $result = Array("status" => true, "data" => Array("statusDelete" => $delete['status']));
        return new Response(json_encode($result), 200, Array('Content-Type', 'text/json'));
    }

    function dateFormat($date) {

        if ($date == '' || $date == '0000-00-00') {
            return '-';
        }

        $dateStamp = strtotime($date);
        $year = date('Y', $dateStamp);
        $month = date('n', $dateStamp);
        $day = date('d', $dateStamp);
        $dayweek = date('w', $dateStamp);

        $dayweekN = array("Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday");
        $monthN = array(1 => "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December");
        return $dayweekN[$dayweek] . ", " . $monthN[$month] . " $day $year";
    }

}
