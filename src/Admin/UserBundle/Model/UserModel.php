<?php

namespace Admin\UserBundle\Model;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

set_time_limit(300);

class UserModel {

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

    public function Users() {
        $qry = 'SELECT * FROM user ORDER BY name';
        $sth = $this->dbh->prepare($qry);
        $sth->execute();
        $status = $sth->execute();
        $data = $sth->fetchAll();
        $r = array('status' => $status, 'data' => $data);
        $result = $this->orderByKey($r, "id", "onlydata");
        return $result;
    }

    public function getUser($id) {
        $qry = 'SELECT * FROM user WHERE id=:id';
        $sth = $this->dbh->prepare($qry);
        $sth->bindParam(":id", $id, \PDO::PARAM_INT);
        $sth->execute();
        $status = $sth->execute();
        $data = $sth->fetchAll();
        return (!empty($data)) ? $data[0] : array();
    }

    public function insertUser($args) {
        $qry = 'INSERT INTO user
            VALUES("", :username, :name,:lastname,:email)';
        $sth = $this->dbh->prepare($qry);
        $sth->bindParam(':username', $args["username"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':name', $args["name"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':lastname', $args["lastname"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':email', $args["email"], \PDO::PARAM_STR, 120);
        $sth->execute();
        $code = intval($sth->errorCode());
        $result["status"] = ($code == 0) ? 1 : 0;
        $result["data"]["id"] = ltrim($this->dbh->lastInsertId(), '0'); //remover ceros a la izquierda
        $result["data"]["code"] = $code;
        return $result;
    }

    public function updateUser($args) {

        $sth = $this->dbh->prepare('UPDATE user SET username= :username,name=:name,lastname=:lastname,email=:email WHERE id = :id');
        $sth->bindParam(":id", $args['id'], \PDO::PARAM_INT);
        $sth->bindParam(':username', $args["username"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':name', $args["name"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':lastname', $args["lastname"], \PDO::PARAM_STR, 120);
        $sth->bindParam(':email', $args["email"], \PDO::PARAM_STR, 120);
        $sth->execute();
        $code = intval($sth->errorCode());
        $result["status"] = ($code == 0) ? 1 : 0;
        $result["data"]["id"] = ltrim($args['id'], '0'); //remover ceros a la izquierda
        $result["data"]["code"] = $code;
        return $result;
    }

    public function deleteUser($id) {

        $sth = $this->dbh->prepare('DELETE FROM user WHERE id = :id');
        $sth->bindParam(":id", $id, \PDO::PARAM_INT);
        $sth->execute();
        $code = intval($sth->errorCode());
        $result["status"] = ($code == 0) ? 1 : 0;
        $result["data"]["id"] = ltrim($id, '0'); //remover ceros a la izquierda
        $result["data"]["code"] = $code;
        return $result;
    }

    public function orderByKey($result, $orderKey, $onlydata) {
        $response = '';
        if ($result['status']) {
            $result_temp = Array();
            foreach ($result['data'] as $key => $value) {
                $result_temp[$value[$orderKey]] = $value;
            }
            clearstatcache();
            $result = Array('status' => TRUE, 'data' => $result_temp);
            $response = (!empty($onlydata)) ? $result['data'] : $result; //regresar todos result o solo data
        } else if (count($result['data']) == 0) {
            /* Verifica si regresó resultados... si no regresa la el status con [data] en NULL */
            $response = $result;
        }

        return $response;
    }

}
