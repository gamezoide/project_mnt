/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).on("click", ".delete", function () {
    obj = null;
    obj = $(this).closest("tr");

    $("#confirm").find(".modal-title").html(obj.attr("data-name"));
    $("#confirm").find(".confirm_text").html('Are you sure you want to delete all data from ' + obj.attr("data-name") + '?');
    $("#confirm").find(".btn-submit").text('Accept').unbind("click").click(function () {
        removeProject(obj);
        $("#confirm").modal("hide");
    });
    $("#confirm").modal("show");

});

function removeProject(obj) {
    $("#confirm").modal("hide");
    $.ajax({                   
        type: 'POST',
        url: url_delete,
        dataType: 'json',
        data: {
            'id': obj.attr("data-id")
        },
        success: function (response) {

            if (response.status) {
                var mssg = '<span class="glyphicon glyphicon-ok"></span> The selected record was succesfully removed.';
                $(".row_" + obj.attr("data-id")).remove();
                $(".error_display").html('<p style="text-align:center;">' + mssg + '</p>');
                $(".error_display").css("background", "#00D204");
                $(".error_display").show();
                setTimeout(function () {
                    $(".error_display").hide();
                }, 9000);

                if ($('#projects tbody tr').length === 0) {
                    $('#projects tbody').html("<tr><td colspan='5'>There are no records to show</td></tr>");
                }

            } else {
                var mssg = '<span class="glyphicon glyphicon-remove"></span> There was an error trying to remove the project.';
                $(".error_display").html('<p style="text-align:center;">' + mssg + '</p>');
                $(".error_display").css("background", "#ff4040");
                $(".error_display").show();
                setTimeout(function () {
                    $(".error_display").hide();
                }, 9000);
            }
        }
    });
}