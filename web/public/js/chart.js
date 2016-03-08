$(document).ready(function () {
    $(".tip").tooltip();
    $('.show-chart').on('click', function () {
        $("#chart").slideToggle();
        $(".printchart").slideToggle();//mostrar botón de imprimir gráfica solo cuando esta esté visible
        //$('.show-chart a').toggleClass("chart-option-selected");
        $('.show-chart span').toggleClass("glyphicon-eye-open glyphicon-eye-close");

        var title_open = textosGenerales.show_chart_help;
        var title_close = textosGenerales.hide_chart_help;

        if ($(".show-chart span").hasClass('glyphicon-eye-open')) {
            $(".show-chart").attr('title', title_open);
            $(".show-chart").attr('data-original-title', title_open);
        }
        else
        {
            $(".show-chart").attr('title', title_close);
            $(".show-chart").attr('data-original-title', title_close);
        }

    });
});

function drawLineChart() {
    var chart;
    var data;
    var width;
    data = new google.visualization.DataTable();
    data.addColumn('string', '');


    if (tipo === "historicodia" || tipo === "historicoacumulado") {
        data.addColumn('number', anio1);
    }
    else {
        data.addColumn('number', leyendaB);
        data.addColumn('number', acumulado);
    }

    if (tipo === "historicodia" || tipo === "historicoacumulado") {
        data.addColumn('number', anio2);
        data.addColumn('number', anio3);
    }

    chart = new google.visualization.LineChart(document.getElementById('chart'));

    width = ($(".panel-body").width() * 0.98);

    var options = getLineChartOptions(acumulado, leyendaB, leyendaR, width);

    $.each(data_graph, function (i, row) {
        var d;
        var a;
        var h;
        switch (tipo) {
            case "dia":
                d = parseInt(row.Preregistro);
                a = parseInt(row.PreregistroAcumulado);
                h = row.Dia;
                data.addRow([h, d, a]);
                break;
            case "semana":
                d = parseInt(row.Preregistro);
                a = parseInt(row.PreregistroAcumulado);
                h = (i + 1).toString();
                data.addRow([h, d, a]);
                break;
            case "historicodia":
                var catorce = parseInt(row.Preregistro2014);
                var trece = parseInt(row.Preregistro2013);
                var doce = parseInt(row.Preregistro2012);
                h = row.Dias_faltantes;
                data.addRow([h, catorce, trece, doce]);
                break;
            case "historicoacumulado":
                var catorce = parseInt(row.Acumulado2014);
                var trece = parseInt(row.Acumulado2013);
                var doce = parseInt(row.Acumulado2012);
                h = row.Dias_faltantes;
                data.addRow([h, catorce, trece, doce]);
                break;
        }

    });
    chart.draw(data, options);
}

function drawGeoChart() {
    var chart;
    var data;
    var width;
    data = new google.visualization.DataTable();
    data.addColumn('string', '');
    data.addColumn('number', preregistrados);

    chart = new google.visualization.GeoChart(document.getElementById('chart'));

    width = ($(".panel-body").width() * 0.98);

    var options = {
        width: width,
        height: 400,
        fontSize: 12,
        datalessRegion: '#BBCCAA',
        keepAspectRatio: true,
        region: tipoMapa,
        resolution: resolucion,
        colors: ['#e0ecf4', '#8856a7'],
        magnifyingGlass: {
            enable: true,
            zoomFactor: 7.5
        },
        hAxis: {
            minValue: 0,
            slantedTextAngle: 60,
            title: leyendaB,
            gridlines: {
                color: '#AADDFC'
            }
        },
        vAxis: {
            title: preregistrados
        },
        chartArea: {},
        backgroundColor: {
            stroke: '#FFF',
            fill: '#FFF',
            strokeWidth: 2
        }

    };

    $.each(data_graph, function (i, row) {
        var a;
        var h;
        switch (tipo) {
            case "estado":
                a = parseInt(row.st_TotalEstados_Preregistrados)
                h = row.Estado;
                break;
            case "pais":
                a = parseInt(row.st_TotalPais_Preregistrados);
                h = (lang === 'en') ? row.Pais_EN : row.Pais_ES;
                break;
        }
        data.addRow([h, a]);

    });
    chart.draw(data, options);

}

function drawPieChart() {
    var chart;
    var data;
    var width;
    data = new google.visualization.DataTable();
    data.addColumn('string', '');
    data.addColumn('number', '');

    chart = new google.visualization.PieChart(document.getElementById('chart'));

    width = ($(".panel-body").width() * 0.98);

    var options = {
        title: leyendaB,
        width: width,
        height: 400,
        fontSize: 12,
        chartArea: {width: "100%", height: "65%"},
        pieSliceText: 'value',
        backgroundColor: {
            //stroke: '#CCC',
            stroke: '#FFF',
            fill: '#FFF',
            strokeWidth: 2
        },
        legend: {
            position: 'top',
            textStyle: {
                fontSize: 12
            }
        },
        tooltip: {
            text: 'percentage'
        }
    };

    $.each(data_graph, function (i, row) {
        var a;
        var n;

        switch (tipo) {
            case "cupon":
                a = row.Cupon + ' (' + row.ST_TotalCupones + ')';
                n = parseInt(row.ST_TotalCupones);
                data.addRow([a, n]);
                break;
            case "actividad":
                a = row.nombre + ' (' + row.total + ')';
                n = parseInt(row.total);
                data.addRow([a, n]);
                break;
        }

    });

    chart.draw(data, options);
}

function getLineChartOptions(acumulado, leyendaB, leyendaR, width) {
    var o;
    if (tipo === "historicodia" || tipo === "historicoacumulado") {

        o = {
            width: width,
            height: 400,
            fontSize: 12,
            pointSize: 3,
            colors: ['red', '#5A78C4', '#9C9696'],
            series: {
                0: {
                    targetAxisIndex: 0
                },
                1: {
                    targetAxisIndex: 0
                },
                2: {
                    targetAxisIndex: 0
                },
                3: {
                    targetAxisIndex: 0
                }
            },
            hAxis: {
                title: leyendaB,
                slantedTextAngle: 60

            },
            vAxes: {
                0: {
                    title: leyendaR
                }
            },
            backgroundColor: {
                //stroke: '#CCC',
                stroke: '#FFF',
                fill: '#FFF',
                strokeWidth: 2
            },
            legend: {
                position: 'top',
                textStyle: {
                    fontSize: 12
                }
            }
            /*, explorer: {//OPCIONES DE ZOOM http://jsfiddle.net/duJA8/
             maxZoomOut: 2,
             keepInBounds: true
             }*/

        };
    }
    else {
        o = {
            width: width,
            height: 400,
            fontSize: 12,
            pointSize: 3,
            colors: ['#1A99AA', '#F76464'],
            series: {
                0: {
                    targetAxisIndex: 0
                },
                1: {
                    targetAxisIndex: 1
                },
                2: {
                    targetAxisIndex: 2
                }
            },
            hAxis: {
                title: leyendaB,
                slantedTextAngle: 60

            },
            vAxes: {
                0: {
                    title: leyendaR
                },
                1: {
                    title: acumulado
                }
            },
            backgroundColor: {
                //stroke: '#CCC',
                stroke: '#FFF',
                fill: '#FFF',
                strokeWidth: 2
            },
            legend: {
                position: 'top',
                textStyle: {
                    fontSize: 12
                }
            }

        };
    }
    return o;
}

function drawColumnChart() {
    var chart;
    var data;
    var width;
    data = new google.visualization.DataTable();
    data.addColumn('string', '');
    if (tipo === "ecosistema") {
        data.addColumn('number', columna1_label);
        data.addColumn('number', columna2_label);
    }
    else
    {
        data.addColumn('number', columna1_label);
    }

    chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    width = ($(".panel-body").width() * 0.98);


    var options = {
        width: width,
        height: 400,
        fontSize: 12,
//        bar: {ancho de las barras en la gráfica
//            groupWidth: 20
//            },
        hAxis: {
            title: leyendaB,
            gridlines: {
                color: '#AADDFC'
            },
            slantedTextAngle: 60


        },
        vAxis: {
            title: leyendaR

        },
//        animation: {
//            duration: 1000,
//            easing: 'inAndOut'
//        },
        chartArea: {},
        backgroundColor: {
            //stroke: '#CCC',
            stroke: '#FFF',
            fill: '#FFF',
            strokeWidth: 2
        },
        legend: {
            position: 'top',
            textStyle: {
                fontSize: 12
            }
        }
    };

//ANIMACIÓN
//var view = new google.visualization.DataView(data);
//view.setColumns([0, {
//    type: 'number',
//    label: data.getColumnLabel(1),
//    calc: function () {return 0;}
//}]);

    $.each(data_graph, function (i, row) {
        switch (tipo) {
            case "ecosistema":
                var integer = parseInt(row.Capacidad);
                var integer2 = parseInt(row.Registrados);
                var capacidad = (isNaN(integer)) ? 0 : integer;
                var registrado = (isNaN(integer2)) ? 0 : integer2;
                data.addRow([row.Nombre, capacidad, registrado]);
                break;
            case "perfilse":
                var integer = parseInt(row.Preregistro);
                var a = (isNaN(integer)) ? 0 : integer;
                data.addRow([row.VisitanteTipo + " (" + integer + ")", a]);
                break;
            case "tipopago":
                var integer = parseInt(row.Preregistro);
                var a = (isNaN(integer)) ? 0 : integer;
                data.addRow([row.Tipo_Registro, a]);
                break;
        }

    });

    //ANIMACIÓN
//    var animate = google.visualization.events.addListener(chart, 'ready', function () {
//    // remove the listener so this doesn't repeat ad infinitum
//    google.visualization.events.removeListener(animate);
//    // draw the chart using the real data, triggering the animation
//    chart.draw(data, options);
//});
//   chart.draw(view, options);
    chart.draw(data, options);
}

function initDataTableDetail() {
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

    $(tableTools.fnContainer()).insertAfter('.printchart');

//    $(".DTTT_button_pdf").addClass("btn btn-danger");
//    $(".DTTT_button_xls").addClass("btn btn-success");

    $(".DTTT_button_pdf").addClass("button float-shadow");
    $(".DTTT_button_xls").addClass("button float-shadow");

}