var identificador = "IDTicket";

// Array de columnas no visibles en la tabla
var arrayColumnas = [1, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];

// Posteriormente, tomará y  llenará un arreglo con los nombres que coincidan en la tabla.
var arrayNombres = [];

var arrayNombreColumnas = [];

$(document).ready(function () {
    listaControlesDiseñador();
    init();
    activaChecks(arrayNombres);
    $("#spnfiltro").hide();
    //agregaExpresiones();
    //agregaCampos();
    var jsonListaCampos = arrayNombreColumnas;
    /*{
    "Nombre": "Nombre",
    "Edad": "Edad",
    "Fecha": "Fecha"
};*/

    var jsonListaExpresiones = {
        "Igual a": "igual",
        "Diferente de: ": "diferente",
        "Contiene": "contiene",
        "No contiene": "no contiene"
    };
    activaPickers();
    $("#getSelectedRows").on("click", function () {
        alert($("#grid").bootgrid("getSelectedRows"));
    });
    //var cNombreClase = ".nombreFiltro";
    generaDropdown(jsonListaCampos, ".nombreFiltro");
    generaDropdown(jsonListaExpresiones, ".tipoFiltro");

    // Agregamos Tooltip a las cabeceras de la tabla
    $('[data-toggle="tooltip"]').tooltip();

    // Generamos una variable templateFiltro que contendrá la fila que contiene el formulario de filtrado
    $(window).data("templateFiltro");
    $(window).data("templateFiltro", $($("div.contenedor-filtro")[0]).clone(true, true));

    // Guardamos el calendario en memoria del navegador.
    $(window).data("templateDatePicker");
    $(window).data("templateDatePicker", $($("div#calendario")).clone(true, true));
    $(window).data("templateDatePicker", $($("div#calendario")).remove());


    // Declaramos el Template del Input y lo guardamos en memoria.
    $(window).data("templateCampo");
    $(window).data("templateCampo", $($("table > tbody > tr > td.campoValor").find(".campoValorInput")[0]).clone(true, true));

    // Guardamos en memoria el template de la fila.
    $(window).data("templateFila");
    $(window).data("templateFila", $($("table > tbody > tr")[0]).clone(true, true));


    //Campo

    $($("div.contenedor-filtro > .calendario")[0]).remove();

    // Eliminamos el label del templateFiltro
    $($(window).data("templateFiltro")).find("label").remove();

    // Agregamos La funcionalidad de Pickers y Badges
    activaBadges();
    //activaPickers();


    // Botón que agrega una columna nueva, para generar filtros.
    $("#agregaFiltro").on("click", function () {

        var templateFiltro = $("#contenedor-filtro"); // tbody

        var a = $(window).data("templateFila"); // Fila
        //$(templateFiltro).append(a.html());
        $(templateFiltro).append($(a).clone(true, true));
        //
        activaEventoDatePickers($(".nombreFiltro"));
        activaPickers();
        activaBadges();
    });
});

// Activa un badge para eliminar una fila con filtros
function activaBadges() {
    var badges = $(".badge");

    $.each(badges, function (indice, badge) {
        $(badge).on("click", function () {
            $(badge).closest("tr").remove();
            //activaPickers();
        });
    });
}

// Activamos todos los DateTimePicker.
function activaPickers() {
    var _cNombreClasePicker = ".dtpFecha";
    var pickers = $(_cNombreClasePicker);
    $.each(pickers, function (indice, picker) {
        $(picker).datetimepicker({
            daysOfWeekDisabled: [0, 6],
            format: "DD/MM/YY"


        });
    });
}


function agregaExpresiones() {

    var expresiones = {
        "Igual a": "igual",
        "Diferente de: ": "diferente",
        "Contiene": "contiene",
        "No contiene": "no contiene"
    };

    var slcExpresiones = $("#tipoFiltro");
    // Pruebas

    $(slcExpresiones).html("");

    var option = document.createElement("option");
    $.each(expresiones, function (indice, valor) {

        $(option).val(valor);
        $(option).text(indice);

        $(slcExpresiones).append($(option).clone());
    });
}

// Genera un Dropdown list, dada una lista.
function generaDropdown(_jsonLista, _cNombreClase, _cNombreClasePicker) {
    var _cNombreClasePicker = _cNombreClasePicker || ".dtpFecha";
    var slcFiltro = $(_cNombreClase);
    $(slcFiltro).html("");
    var li = document.createElement("li");
    var a = document.createElement("a");

    $.each(_jsonLista, function (indice, valor) {
        $(slcFiltro).append($("<li><a>" + valor + "</a></li>"));
    });
    activaLinks();
}

// Activamos el evento click de los links.
// Que tiene comom función Verificar en el dropdown list, si hay un campo de fecha.
// De lo contrario, asignarle el campo seleccionado.
function activaLinks() {
    $('.dropdown-menu a').on('click', function () {
        var ul = $(this).closest("ul");


        if (ul.hasClass("nombreFiltro") == true) {

            if ($(this).html().toLowerCase().indexOf("fecha") >= 0) {
                $(this).closest("td").siblings(".campoValor").find("span.campoValorInput").replaceWith($(window).data("templateDatePicker").html());
                activaPickers();

            } else {
                /// Para Terminar
                $(this).closest("td").siblings(".campoValor").find("span.campoValorInput").replaceWith($(window).data("templateCampo").html());
                $(this).parent().parent().prev().html($(this).html() + '<span class="caret"></span>');
            }
            //$(this).parent().parent().prev().html($(this).html() + '<span class="caret"></span>');
            $(this).closest("ul").siblings("button").html($(this).html() + '<span class="caret"></span>');
        }
        $(this).closest("ul").siblings("button").html($(this).html() + '<span class="caret"></span>');


    });
}
//// Agregamos o no las ventanas de fechas 
function activaEventoDatePickers(slcNombreFiltro) {
    $(slcNombreFiltro).on("click", function (indice, option) {
        var valor = $(this).val();
        var dtpicker = $(window).data("templateDatePicker");
        var dcampo = $(window).data("templateCampo");

        if (valor.toLowerCase().indexOf("fecha") >= 0) {
            var campo = $(this).parent().siblings("span.Input");
            $(campo).replaceWith($(dtpicker));
            activaPickers();

        } else {
            var calendario = $(this).parent().siblings("span.calendario");
            $(calendario).replaceWith($(dcampo));
        }
    });
}



function activaChecks(arrayNombres) {
    $.each(arrayNombres, function (indice, valor) {
        checks = $("input:checkbox[name='" + valor + "']").trigger("click");
    });
}

// Lista elementos
function listaControlesDiseñador() {
    jQuery.support.cors = true;
    var formData = { callback: "87098", folio: "0" };
    if (window.XDomainRequest) {
        // Use Microsoft XDR
        var xdr = new XDomainRequest();
        xdr.open("post", "http://isla.merida.gob.mx/scripts/cgiip.exe/WService=wsSISU/TicketsEscalados.r");
        xdr.onload = function () {
            var JSON = $.parseJSON(xdr.responseText);
            if (JSON == null || typeof (JSON) == 'undefined') {
                JSON = $.parseJSON(data.firstChild.textContent);
            }
            processData(JSON);
        };
        xdr.send();
    } else {
        $.ajax({
            type: 'POST',
            url: "wsPrueba.asmx/WebServiceMerida",
            async: false,
            contentType: "application/json; charset=ISO-8859-1",
            dataType: "json",
            success: function (data) {
                //console.log(data);
                var registros = JSON.parse(data.d);
                var filas = registros.rows;

                // Guardamos el JSON de las filas devueltas.

                $(window).data("rows", filas);

                var slcCampos = $("#nombreFiltro");
                $(slcCampos).html("");

                var i = 0;

                // Manda los encabezados de las columnas
                $.each(filas[0], function (identificador, valor) {

                    var trDinamico = $("#trdinamico");
                    var th = document.createElement("th");

                    if ($.inArray(i, arrayColumnas) > -1) {
                        arrayNombres.push(identificador);
                    }
                    else {

                    }
                    arrayNombreColumnas.push(identificador);

                    $(th).attr("data-visible-in-selection", "true");
                    $(th).attr("data-filterable", "true");
                    $(th).attr("data-searchable", "true");

                    $(th).attr("data-column-id", identificador);
                    $(th).attr("data-type", "numeric");
                    $(th).attr("data-header-css-class", "column");
                    $(th).addClass("text-center");

                    var option = document.createElement("option");

                    $(option).text(identificador);
                    $(option).val(identificador);

                    $(slcCampos).append($(option));

                    $(th).text(identificador);
                    if (identificador === "Descripcion")
                    {
                        $(th).attr("data-formatter", "descripcion");
                    }
                    if (identificador === "acciones") {
                        $(th).attr("data-formatter", "acciones");
                    }
                    if (identificador == window.identificador) {
                        $(th).attr("data-formatter", "commands");
                        //$(th).attr("data-identifier", "true");
                        var thn = document.createElement("th");
                        $(thn).attr("data-visible-in-selection", "true");

                        $(thn).attr("data-column-id", "Acciones");
                        //$(thn).attr("data-visible-in-selection", "true");
                        //$(thn).attr("data-searchable", "true");
                        
                        //$(thn).attr("data-type", "numeric");
                        $(thn).attr("data-header-css-class", "column");
                        $(thn).addClass("text-center");
                        $(thn).attr("data-formatter", "acciones");
                        $(thn).text("Acciones");

                        $(trDinamico).prepend(thn);
                    }
                    $(trDinamico).append(th);
                    i++;
                });
            },
            error: function (xhr, status, result) {
                alert('Disculpe, existió un problema, estatus: ' + status + " detalle del error: " + result);
            }
        });
    }
}

function init() {
    var grid = $("#grid").bootgrid({
        searchSettings: {
            delay: 250,
            characters: 3
        },
        //ajax: true,
        ajaxSettings: {
            method: "POST",
            cache: false,
            async: true
        },
        labels: {
            noResults: "No se encontraron registros.",
            refresh: "Actualizando....",
            loading: "Cargando....",
            search: "Búsqueda"

        },
        formatters: {
            "commands": function (column, row) {
                var id = eval("row." + identificador);
                return "<button type=\"button\" class=\"btn btn-xs btn-link command-edit\" data-row-id=\"" + id + "\" onclick=\"mensaje('" + id + "');\"><span class=\"fa fa-pencil\"></span>&nbsp;&nbsp;" + row.IDTicket + "</button>";
            },
            "descripcion": function (column, row) {
                //return "<img src=\"\" height=\"20\" width=\"20\" class=\"btn btn-xl btn-default command-modal\" data-toggle=\"modal\" data-target=\"#" + row.IDTicket + "\" ><div class=\"modal fade\" id=\"" + row.IDTicket + "\" role=\"dialog\" tabindex=\"-1\" aria-labelledby=\"gridSystemModalLabel\"><div class=\"modal-dialog \" role=\"dialog\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-header\"><h4 class=\"modal-title\">" + row.IDTicket + " (" + row.Asignado + ")" + "</h4></div><div class=\"modal-body\"><p>" + row.Descripcion + "</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cerrar</button></div></div></div></div></div>";
                return '<p data-toggle="tooltip" data-placement="auto" title="' + row.Descripcion + '">' + row.Descripcion + '</p>';
            },
            "acciones": function (column, row) {
                return '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>';
            }
            //"Acciones": function (column, row) {
            //    var id = eval("row.IDTicket");
            //    return "<button type=\"button\" class=\"btn btn-xs btn-link command-edit\" data-row-id=\"Acciones\" onclick=\"mensaje('" + id + "');\"><span class=\"fa fa-pencil\"></span>&nbsp;&nbsp;Acciones</button>";
            //}
        }
    }).on("loaded.rs.jquery.bootgrid", function () {
        /* Executes after data is loaded and rendered */
        grid.find(".command-edit").on("click", function (e) {
            alert("You pressed edit on row: " + $(this).data("row-id") + $(this).data("row-sistema"));
        }).end().find(".command-delete").on("click", function (e) {
            alert("You pressed delete on row: " + $(this).data("row-id"));
        });
    });
    var filtro = $(window).data("rows");

    $("#grid").bootgrid("clear");
    $("#grid").bootgrid("append", filtro);

}
function BorrarFiltros() {
    var filtro = $(window).data("rows");
    $("#grid").bootgrid("clear");
    $("#grid").bootgrid("append", filtro);
}
function activaTab(tab) {
    $('.nav-tabs nav-pills a[href="#' + tab + '"]').tab('show');
};
function filtrar() {
    try {

        // Obtenemos los rows de los filtros
        var filtro = $(window).data("rows");


        $.each($("table > tbody#contenedor-filtro > tr"), function (indice, tr) {
            console.log($(this).find("button").val());

            var nombreFiltro = $(tr).find("ul.nombreFiltro").siblings("button").text(); //"FechaSolicitud";//$("#nombreFiltro").val();
            var tipoFiltro = $(tr).find("ul.tipoFiltro").siblings("button").text(); // "igual"; //$("#tipoFiltro").val();
            var valorFiltro = $(tr).find("input.valorFiltro").val(); // "11/02/16"; // $("#valorFiltro").val();
            filtro = _.filter(filtro, function (registro) {
                var Registro = eval("registro." + nombreFiltro).toLowerCase();
                valorFiltro = valorFiltro.toLowerCase();

                switch (tipoFiltro) {
                    case "igual":
                        return Registro == valorFiltro;
                    case "diferente":
                        return Registro != valorFiltro;;
                    case "contiene":
                        return -1 != Registro.search(valorFiltro);
                    case "no contiene":
                        return -1 == Registro.search(valorFiltro);
                    default:
                        return eval("registro." + nombreFiltro + " " + tipoFiltro + " '" + valorFiltro + "'");
                }
            });
        });

    }
    catch (e) {
        filtro = $(window).data("rows");
    }

    $("#grid").bootgrid("clear");
    $("#grid").bootgrid("append", filtro);
}
function mensaje(id) {
    try {
        id = parseInt(id);
        var filtro = $(window).data("rows");
        var objeto = new Object();
        var campoDescripcion = "";
        eval("objeto." + identificador + "= id;");
        registro = _.where(filtro, objeto);
        $.each(filtro, function (indice, valorRegistro) {
            if (filtro[indice].IDTicket == objeto.IDTicket) {
                var ul = document.createElement("ul");
                $(ul).addClass("nav nav-tabs");
                $(ul).append($('<li><a data-toggle="tab" id="lnkFormulario" href="#formulario">Detalles Ticket</a></li>'));
                $(ul).append($('<li><a data-toggle="tab" id="lnkHistorial" href="#historial">Historial</a></li>'));

                var dvPill = document.createElement("div");
                $(dvPill).addClass("tab-content");

                var dvForm = document.createElement("div");
                $(dvForm).attr("id", "formulario");
                $(dvForm).addClass("tab-pane fade");

                var dvHistorial = $('<form class="form-horizontal" name="historial"><div class="form-horizontal"></div></div></form>');//document.createElement("div");
                $(dvHistorial).attr("id", "historial");
                $(dvHistorial).addClass("tab-pane fade");

                var dvFormulario = document.createElement("div");
                var formulario = $('<form class="form-horizontal" name="commentform"><div class="form-horizontal"></div></div></form>');


                var ulConversacionesPills = document.createElement("ul");
                $(ulConversacionesPills).addClass("nav nav-tabs nav-pills");

                var dv = $('<div class="tab-content"></div>');

                var campo = $('<div class="form-group"></div>');
                var contenedorBotones = $('<div class="tabbable"></div>');
                // Obtenemos la fila del listado
                $.each(filtro[indice], function (indiceObjeto, valorObjeto) {
                    // Si halla la propiedad historial
                    if (indiceObjeto.toLowerCase().indexOf("historial") >= 0) {
                        $.each(valorObjeto, function (indiceHistorial, historialValor) {
                            var iConversacion = indiceHistorial + 1;


                            //$(ulConversacionesPills).attr("id", iConversacion);

                            $(ulConversacionesPills).append($('<li><a href="#tab' + iConversacion + '" data-toggle="tab" id="' + iConversacion + '">' + iConversacion + '</a></li>'));

                            //var btn = $('<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#' + iConversacion + '">Historial # : ' + iConversacion + '</button>');
                            //$(contenedorBotones).append(btn);


                            var dvElementosHist = $('<div class="tab-pane" id="tab' + iConversacion + '"></div>');
                            //var dv = $('<div id="' + iConversacion + '" class="collapse"></div>');
                            var campoHistorial = $('<div class="form-group"></div>');
                            $.each(historialValor, function (clave, valorConversacion) {
                                //$(dvElementosHist).append('<label class="control-label col-md-4" for="' + clave + '">' + valorConversacion + '</label>');
                                $(dvElementosHist).append('<p><b>' + clave + '</b></p>');
                                if (clave === "Adjuntos") {
                                    $.each(valorConversacion, function (claveAdjunto, adjunto) {
                                        $(dvElementosHist).append('<p><a target="_blank" href="http://isla.merida.gob.mx/serviciosinternet/sisu/modphpx/phpDescargaAdjuntos.phpx?archivo=' + adjunto + '">' + adjunto + '</p>');
                                    });
                                }
                                else {
                                    $(dvElementosHist).append('<p>' + valorConversacion + '</p>');
                                }
                            });
                            $(contenedorBotones).append(ulConversacionesPills);
                            $(dvHistorial).prepend(contenedorBotones);
                            //$(dvHistorial).prepend(contenedorBotones);

                            $(dv).append(dvElementosHist);

                            $(dvHistorial).append(dv);
                            //$(dvHistorial).append(dv.clone());
                        });
                    } else {
                        if (indiceObjeto.toLowerCase().indexOf("descripcion") >= 0) {
                            campoDescripcion += ('<label class="control-label col-md-4" for="' + indiceObjeto + '">' + indiceObjeto + '</label>');
                            campoDescripcion += '<div class="col-md-6"><textarea class="form-control" id="' + indiceObjeto + '" placeholder="' + indiceObjeto + '" style="height:400px;" >' + valorObjeto + '"</textarea></div>';
                        }
                        else {
                            campo.append('<label class="control-label col-md-4" for="' + indiceObjeto + '">' + indiceObjeto + '</label>');
                            campo.append('<div class="col-md-6"><input type="text" class="form-control" id="' + indiceObjeto + '" placeholder="' + indiceObjeto + '" value="' + valorObjeto + '"></div>');
                        }
                        /*
                                         <div class="tabbable">
                                        <ul class="nav nav-tabs nav-pills" id="myTab">
                                            <li class="active"><a href="#tab1" data-toggle="tab">Part 1</a>
        
                                            </li>
                                        </ul>
                                        <div class="tab-content">
                                            <div class="tab-pane active" id="tab1">aaaaaaaaaaaa</div>
                                        </div>
                                    </div>
                         */


                        //$(formulario).append(campo.clone());
                    }
                });
                campo.append(campoDescripcion);
                $(formulario).append(campo.clone());

                $(dvForm).html($(formulario));
                $(dvPill).append(dvForm);
                $(dvPill).append(dvHistorial);

                $(dvFormulario).append(ul);
                $(dvFormulario).append(dvPill);
                dvHistorial = document.createElement("div");
                var dialog = BootstrapDialog.show({ 
                    title: "Número de Ticket: " + id,
                    message: dvFormulario,
                    onshow: function (dialog) {
                        //dialog.getButton('button-c').disable();
                        dialog.setSize(BootstrapDialog.SIZE_WIDE);
                        //activaTab('formulario');
                    }
                });
                dialog.getModalHeader().css('background-color', '#0088cc');
                dialog.getModalHeader().css('color', '#fff');
            }
        });
    } // Fin del try

    catch (e) {
        alert("Ha Ocurrido un error " + e.message);
    }
}

//function creaBreadCrumbs(objHistorial) {
//    var dv = $('<div class="Breads"></div>');
//    var li = document.createElement("li");
//    var ul = document.createElement("ul");



//    $.each(objHistorial, function (indice, valor) {

//    });

//}

//function init()
//{
//    var grid = $("#grid");
//    $(grid).bootgrid({
//        ajax: true,
//        ajaxSettings: {
//            method: "GET",
//            cache: false
//        },
//        url: "data.json",
//        formatters: {
//            "commands": function (column, row)
//            {
//                return "<button type=\"button\" class=\"btn btn-xs btn-default btn-info command-edit\" data-row-id=\"" + row.a + "\" onclick=\"mensaje('" + row.a + "');\"><span class=\"fa fa-pencil\"></span>&nbsp;&nbsp;Ver Detalles</button>";

//                //return "<button class=\"btn-default btn\" data-content-close=\"Close\" data-content-id=\"Div\" data-content-save=\"Save\" data-target=\"#6698CB2F-2948-45D9-8902-2C13A7ED6335\" data-title=\"Title\" data-toggle=\"modal\" type=\"button\">Show modal</button>";

//            },
//            "link": function (column, row)
//            {
//                return "<img src=\"Student/getPhoto/" + row.a + "\" />";
//            }
//        },
//        css: {
//            /*pagination: 'pagination pagination-sm',
//            paginationButton: 'btn-warning btn-sm'*/
//            icon: 'md icon',
//            iconColumns: 'md-view-module',
//            iconDown: 'md-expand-more',
//            iconRefresh: 'md-refresh',
//            iconUp: 'md-expand-less'
//        },
//        caseSensitive: false,
//        searchSettings: { delay: 250, characters: 3 },
//        //},

//        rowCount: [-1, 2, 4, 8, 10] // No me respeta esta propiedad
//        // selectedRowCount: 8

//    }).on("loaded.rs.jquery.bootgrid", function ()
//    {

//        $(grid).find("li .active");
//        //alert("Iniciando");

//    });
//}

//$("#append").on("click", function ()
//{
//    $("#grid").bootgrid("append", [{
//        id: 0,
//        sender: "hh@derhase.de",
//        received: "Gestern",
//        link: ""
//    },
//    {
//        id: 12,
//        sender: "er@fsdfs.de",
//        received: "Heute",
//        link: ""
//    }]);
//});

/*$("#clear").on("click", function ()
{
    $("#grid").bootgrid("clear");
});

$("#removeSelected").on("click", function ()
{
    $("#grid").bootgrid("remove");
});

$("#destroy").on("click", function ()
{
    $("#grid").bootgrid("destroy");
});

$("#init").on("click", init);

$("#clearSearch").on("click", function ()
{
    $("#grid").bootgrid("search");
});

$("#clearSort").on("click", function ()
{
    $("#grid").bootgrid("sort");
});

$("#getCurrentPage").on("click", function ()
{
    alert($("#grid").bootgrid("getCurrentPage"));
});

$("#getRowCount").on("click", function ()
{
    alert($("#grid").bootgrid("getRowCount"));
});

$("#getTotalPageCount").on("click", function ()
{
    alert($("#grid").bootgrid("getTotalPageCount"));
});

$("#getTotalRowCount").on("click", function ()
{
    alert($("#grid").bootgrid("getTotalRowCount"));
});

$("#getSearchPhrase").on("click", function ()
{
    alert($("#grid").bootgrid("getSearchPhrase"));
});

$("#getSortDictionary").on("click", function ()
{
    alert($("#grid").bootgrid("getSortDictionary"));
});

$("#getSelectedRows").on("click", function ()
{
    alert($("#grid").bootgrid("getSelectedRows"));
});*/