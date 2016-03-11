/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$("#user").change(function () {
    if (parseInt($(this).val()) !== 0) {
        add($(this).val());
    }
});

$(".add_user").click(function () {
    $(".add_user").toggleClass('open closed');
    $(".add_user .plus").toggleClass('glyphicon-plus');
    $(".add_user .user").toggleClass('glyphicon-user glyphicon-chevron-left');
    $(".btn-group").slideToggle();

    if ($('.user').hasClass("glyphicon-chevron-left")) {
        setTimeout(function () {
            $(".dropdown-toggle").trigger("click");
       }, 1000);

    }

});

$(document).on("click", ".glyphicon-chevron-left", function () {
    $('#user').val(0);
    $('.selectpicker').selectpicker('refresh');
});

$(document).on("click", ".delete", function () {
    var id = $(this).parent().attr("data-id");
    $("#confirm").find(".modal-title").html($(this).parent().attr("data-name"));
    $("#confirm").find(".confirm_text").html('Are you sure you want to unassign ' + $(this).parent().attr("data-name") + ' from this project?');
    $("#confirm").find(".btn-submit").text('Accept').unbind("click").click(function () {
        remove(id);
        $("#confirm").modal("hide");
    });
    $("#confirm").modal("show");

});

function add(value) {

    if ($('#user_' + value).length > 0) {
        var mssg = '<span class="glyphicon glyphicon-remove"></span> The selected user is already added to this project.';
        display_error(mssg, false);
        return;
    }

    $("#confirm").modal("hide");
    $.ajax({                   
        type: 'POST',
        url: url_add,
        dataType: 'json',
        data: {
            'user': value,
            'project': $("#id").val()
        },
        success: function (response) {

            if (response.status) {
                var mssg = '<span class="glyphicon glyphicon-ok"></span> The selected user was succesfully added to this project.';
                display_error(mssg, true);

                var text = $("#user option[value='" + value + "']").text();
                $(".assigned").append("<span data-id='" + value + "' data-name='" + text + "' id='user_" + value + "'>" + text + " <i class='glyphicon glyphicon-remove delete'></i></span>");

            } else {
                var mssg = '<span class="glyphicon glyphicon-remove"></span> There was an error trying to add the user to this project.';
                display_error(mssg, false);
            }
        }
    });

}

function remove(value) {
    $("#confirm").modal("hide");
    $.ajax({                   
        type: 'POST',
        url: url_delete,
        dataType: 'json',
        data: {
            'user': value,
            'project': $("#id").val()
        },
        success: function (response) {

            if (response.status) {
                var mssg = '<span class="glyphicon glyphicon-ok"></span> The selected user was succesfully removed from this project.';
                display_error(mssg, true);

                $("#user_" + value).replaceWith("");

            } else {
                var mssg = '<span class="glyphicon glyphicon-remove"></span> There was an error trying to remove the user from this project.';
                display_error(mssg, false);
            }
        }
    });
}