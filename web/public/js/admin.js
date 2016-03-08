function dialogConfirm(param) {
    var defaults = {
        "title": "",
        "content": "",
        "callback": ""
    };
    var settings = $.extend({}, defaults, param);
    $("#confirm-modal").find(".modal-title").html(settings.title);
    $("#confirm-modal").find("#text-confirm").html(settings.content);
    $("#confirm-modal").find(".btn-submit").text(textosGenerales.aceptar).unbind("click").click(settings.callback);
    $("#confirm-modal").modal("show");
}

function resetForm(id) {
    $('p.validateTips').html('');
    //$('#' + id).find('.ui-state-error').removeClass('ui-state-error');
    $('#' + id).find('.has-error').removeClass('has-error');
    $('#' + id).find('input').val('');
    $('#' + id).find('textarea').val('');
    $('#' + id).find('checkbox').removeAttr('checked');
    $('#' + id).find('radio').removeAttr('checked');
    $('#' + id).find("select").prop('selectedIndex', 0);
    $('#' + id).find("select").selectpicker('refresh');//reset dropdowns
    $('#' + id).find('checkbox').selectpicker('refresh');
    $('input:checkbox:checked').prop("checked", false);//en ocasiones removeAttr no funciona bien con checks
    /*Disparar el evento con que switch.js cambia las clases de los switches ya que con prop solo se quita el checked y los estilos no cambian*/
    /*Nota: al quitar el estilo .bootstrap-switch-on y agregar el estilo de manera directa .bootstrap-switch-off en ocasiones los switches no reaccionan bien al evento click*/
    $(".bootstrap-switch-primary").trigger("click.bootstrapSwitch");
}

//function showBouncyNotification(tipo) {
//    // create the notification
//    var notification = new NotificationFx({
//        message: '<span class="icon icon-calendar"></span><p>The event was added to your calendar. Check out all your events in your <a href="#">event overview</a>.</p>',
//        layout: 'attached',
//        effect: 'bouncyflip',
//        type: tipo, // notice, warning or error
//        ttl: 400,
//        onClose: function() {
//
//        }
//    });
//
//    // show the notification
//    notification.show();
//
//}
//
//function showGrowlNotification() {
//
//    // create the notification
//    var notification = new NotificationFx({
//        message: '<p>This is just a simple notice. Everything is in order and this is a <a href="#">simple link</a>.</p>',
//        layout: 'growl',
//        effect: 'scale',
//        type: 'notice', // notice, warning, error or success
//        ttl: 5400,
//        onClose: function() {
//
//        }
//    });
//
//    // show the notification
//    notification.show();
//
//}

function showNotification(tp, msj, tm) {//http://tympanus.net/codrops/2014/07/23/notification-styles-inspiration/
    // create the notification
    var ly = "attached";
    var eff = "bouncyflip";
    var notification = new NotificationFx({
        message: msj,
        layout: ly,
        effect: eff,
        type: tp, // notice, warning or error
        ttl: tm,
        onOpen: function() {

        },
        onClose: function() {

        }
    });

    // show the notification
    notification.show();
}


function validateFormAdmin(rules_custom, funcion) {

    $('#main-form').validate({
        errorClass: "invalid",
        errorElement: "div",
        ignore: ":hidden:not(select)",
        highlight: function(element, errorClass, validClass) {
            $(element).parent().addClass('has-error', 1000, "easeOutBounce");
            var elem = element;
            if ($(element).get(0).nodeName === "SELECT") {
                element = $(element).parent().find('button');
                element.parent().find('button').trigger("click");//mostrar error en select
            } else {
                element = $(element).parents('.dg-section-block');
            }
            element.addClass('has-error', 1000, "easeOutBounce");
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parent().removeClass('has-error', 1000, "easeOutBounce");
            if ($(element).get(0).nodeName === "SELECT") {
                element = $(element).parent().find('button');
            } else {
                element = $(element).parents('.dg-section-block');
            }
            element.removeClass('has-error', 1000, "easeOutBounce");
        },
        errorPlacement: function(error, element) {
            if (element.get(0).nodeName === "SELECT") {
                element = element.parent().find('button');
            }
            error.insertAfter(element);

        },
        rules: rules_custom, //asignar reglas recibidas como parametro
        submitHandler: function(form) {
            funcion();//ejecutar función recibida como parametro
            return;
        }
    });
}

jQuery.extend(jQuery.validator.messages, {//mensajes usados para validaciones
    required: textosValidacion.campo_obligatorio,
    digits: textosValidacion.campo_numeros
});

function initDataTableAdmin() {
    table = $('.table-detail').DataTable({
        responsive: false,
        paging: false,
        language: {
            "url": datatable_lang
        },
        bAutoWidth: false,
        "bSort": false,
        "info": false
    });

    var excel = "<span class='glyphicon glyphicon-list-alt'></span> " + textosGenerales.exportar + " " + textosGenerales.excel;
    var pdf = "<span class='glyphicon glyphicon-file'></span> " + textosGenerales.exportar + " " + textosGenerales.pdf;

    var tableTools = new $.fn.dataTable.TableTools(table, {
        "sSwfPath": datatable_swf,
        "aButtons": [
            {
                "sExtends": "pdf",
                "sButtonText": pdf
            },
            {
                "sExtends": "xls",
                "sButtonText": excel
            }
        ]

    });

    $(tableTools.fnContainer()).insertAfter('#chart');

    $(".DTTT_button_pdf").addClass("btn btn-danger");
    $(".DTTT_button_xls").addClass("btn btn-success");
}