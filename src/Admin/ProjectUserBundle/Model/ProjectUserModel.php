<?php

namespace Admin\ProjectUserBundle\Model;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

set_time_limit(300);

class ProjectUserModel {

    private $host;
    private $port;
    private $name;
    private $user;
    private $pass;
    public $dbh;

    function __construct() {
        $container = new ContainerBuilder();
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . "/../../../../app/config"));
        $loader->load('parameters.yml');

        $this->host = $container->getParameter("database_host");
        $this->name = $container->getParameter("database_name");
        $this->user = $container->getParameter("database_user");
        $this->pass = $container->getParameter("database_password");
        $this->port = $container->getParameter("database_port");

        $options = array(
            \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        );
        return $this->dbh = new \PDO("mysql:host=$this->host;dbname=$this->name;port=$this->port", $this->user, $this->pass, $options);
    }

    public function getProjectsUsers() {
        $qry = 'SELECT user, p.id, p.title FROM project p LEFT JOIN project_user pu ON pu.project=p.id ORDER BY p.title';
        $sth = $this->dbh->prepare($qry);
        $sth->execute();
        $status = $sth->execute();
        $data = $sth->fetchAll();
        return (!empty($data)) ? $data : array();
    }

    public function getProjectUsers($id) {
        $qry = 'SELECT user, username FROM project_user p JOIN user u ON p.user=u.id WHERE project=:project';
        $sth = $this->dbh->prepare($qry);
        $sth->bindParam(':project', $id, \PDO::PARAM_STR, 120);
        $sth->execute();
        $status = $sth->execute();
        $data = $sth->fetchAll();
        return (!empty($data)) ? $data : array();
    }

    public function insertProjectUser($args) {
        $qry = 'INSERT INTO project_user
            VALUES("", :user, :project)';
        $sth = $this->dbh->prepare($qry);
        $sth->bindParam(':user', $args["user"], \PDO::PARAM_INT);
        $sth->bindParam(':project', $args["project"], \PDO::PARAM_INT);
        $sth->execute();
        $code = intval($sth->errorCode());
        $result["status"] = ($code == 0) ? 1 : 0;
        $result["data"]["id"] = ltrim($this->dbh->lastInsertId(), '0'); //remover ceros a la izquierda
        $result["data"]["code"] = $code;
        return $result;
    }

    public function deleteProjectUser($args) {

        $sth = $this->dbh->prepare('DELETE FROM project_user WHERE user =:user AND project=:project');
        $sth->bindParam(':user', $args["user"], \PDO::PARAM_INT);
        $sth->bindParam(':project', $args["project"], \PDO::PARAM_INT);
        $sth->execute();
        $code = intval($sth->errorCode());
        $result["status"] = ($code == 0) ? 1 : 0;
        $result["data"]["code"] = $code;
        return $result;
    }

}
