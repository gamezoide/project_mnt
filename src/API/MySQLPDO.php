<?php

namespace API;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MySQLPDO
 *
 * @author Luis
 */
class MySQLPDO {

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

}
