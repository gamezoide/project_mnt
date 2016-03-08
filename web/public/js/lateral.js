$(document).ready(function () {

    $('.list-group').on('click', function () {
        $('#menul-toggle').trigger('click');//cerrar menú lateral
        $("#loader").slideDown('2000');//mostrar loader
    });

    //http://www.jqueryscript.net/menu/Simple-jQuery-CSS3-Based-Off-canvas-Sidebar-Navigation.html
    $('#menul-toggle').click(function () {//condición cambiada por toggles
        $('#menul-toggle span').toggleClass("glyphicon-remove glyphicon-align-justify");
        $('#menul').toggleClass("open");
        $('#menul-toggle').toggleClass("open");
    });
});