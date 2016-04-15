var identificador = "IDTicket";

// Array de columnas no visibles en la tabla
var arrayColumnas = [1, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];

// Posteriormente, tomará y  llenará un arreglo con los nombres que coincidan en la tabla.
var arrayNombres = [];

var arrayIdsTicketsCliente = new Array();

var IdsTFSyIdsSISU = null;

var arrayNombreColumnas = [];
var webServiceContesta = true;
var sistemas = null;
var clicModuloTFS = "";
var clicSistemaTFS = "";
var clicDescripcion = "";
var clicIdSISU = 0;
var arrayModulosGenericos = ["Opciones del Sistema", "Administrador de Procesos", "Administrador de Oficios", "Administrador de Padrones", "Administrador de Reportes"];
var usuariosWindows = ["jorge.aldana", "gaspar.garcia", "reyes.aguilar", "elisa.gonzalez", "roberto.bracamonte", "sergio.sanchez"];
var usuariosTFS = ["Jorge Adrian Aldana Ake", "Gaspar Jesus Garcia Zavala", "Reyes Aguilar Medina", "Linda Elisa Gonzalez Cobos", "Roberto Carlos Bracamonte Coello", "Sergio Sanchez Garcia"];
var nombreRecursoTFS = "Ricardo Chi Keb";
var nombreWindows = "";
var errorWebService = "";

$(document).ready(function () {
    $("#spnfiltro").hide();
    $('#filtroText').keypress(function (event) {
        if (event.keyCode == 10 || event.keyCode == 13)
            event.preventDefault();
    });
    obtenerNombreRecursoTFS();
    listaControlesDiseñador();
    ObtenerJSONSistemas();
    ObtenerIdsTFS();
    if (webServiceContesta) {
        init();
        activaChecks(arrayNombres);
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
    }
    else {
        //Todo mejorar el mensaje en un dialogo
        var tempModal = BootstrapDialog.alert("Fallo el webservice: " + errorWebService);
        tempModal.setType(BootstrapDialog.TYPE_DANGER);
        //alert("Fallo el web service");
    }
});


function ActualizarWebService()
{
    $.ajax({
        type: 'POST',
        url: "wsServicio.asmx/WebServiceMerida",
        async: true,
        contentType: "application/json; charset=ISO-8859-1",
        dataType: "json",
        success: function (data) {
            var registros = JSON.parse(data.d);
            var filas = registros.rows;
            // Guardamos el JSON de las filas devueltas.
            $(window).data("rows", filas);
            var filtro = $(window).data("rows");
            $("#grid").bootgrid("clear");
            $("#grid").bootgrid("append", filtro);
        }
    });
}

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

function obtenerNombreRecursoTFS()
{
    nombreWindows = $("#loginName").text();
    nombreWindows = nombreWindows.split('\\')[1];
    var indexNombreTFS = usuariosWindows.indexOf(nombreWindows);
    if(indexNombreTFS > 0)
    {
        nombreRecursoTFS = usuariosTFS[indexNombreTFS];
    }
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

function ObtenerJSONSistemas()
{
    var url = "MappingDatosSISUTFS.json";
    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        async: false,
        success: function (data) {
            sistemas = data;
        }
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
        $('#filtroText').keypress(function (event) {
            if (event.keyCode == 10 || event.keyCode == 13)
                event.preventDefault();
        });
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

function byKey(arr, key) {
    for (var i = 0, L = arr.length; i < L; i++) {
        //if (arr[i].IDTicket === key) {
            //return arr[i];
        //}
        arrayIdsTicketsCliente[i] = arr[i].IDTicket;
    }
}

function getFolioTFSBySISUID(data, code) {
    return data.filter(
        function (data) { return data.idSISU == code }
    );
}

function getSistemaTFSBySISUSistema(data, sistema) {
    return data.filter(
        function (data) { return data.sisu.toLowerCase() == sistema.toLowerCase() }
    );
}

function ObtenerIdsTFS() {
    $.ajax({
        type: 'POST',
        url: "wsServicio.asmx/ObtenerIdsTFS",
        async: false,
        data: '{"IdsSISU":"' + arrayIdsTicketsCliente + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            IdsTFSyIdsSISU = JSON.parse(data.d);
        }
    });
}

// Lista elementos
function listaControlesDiseñador() {
    try{
        $.ajax({
            type: 'POST',
            url: "wsServicio.asmx/WebServiceMerida",
            async: false,
            contentType: "application/json; charset=ISO-8859-1",
            dataType: "json",
            success: function (data) {
                //console.log(data);
                //var json = JSON.stringify(data.d);
                var registros = JSON.parse(data.d);
                var filas = registros.rows;

                // Guardamos el JSON de las filas devueltas.

                $(window).data("rows", filas);

                byKey(filas, "IDTicket");

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
                        $(th).attr("data-header-css-class", "column");
                    }
                    if (identificador == window.identificador) {
                        $(th).attr("data-formatter", "commands");
                        $(th).attr("data-header-css-class", "column");
                        //$(th).attr("data-identifier", "true");

                        var thn2 = document.createElement("th");
                        $(thn2).attr("data-visible-in-selection", "true");

                        $(thn2).attr("data-column-id", "IdTFS");
                        //$(thn).attr("data-visible-in-selection", "true");
                        //$(thn).attr("data-searchable", "true");

                        //$(thn).attr("data-type", "numeric");
                        $(thn2).attr("data-header-css-class", "column");
                        //$(thn).addClass("text-center");
                        $(thn2).attr("data-formatter", "idTFS");
                        $(thn2).attr("data-header-css-class", "column");
                        $(thn2).text("IDTFS");
                        $(trDinamico).prepend(thn2);

                        //crear columna acciones
                        var thn = document.createElement("th");
                        $(thn).attr("data-visible-in-selection", "true");

                        $(thn).attr("data-column-id", "Acciones");
                        //$(thn).attr("data-visible-in-selection", "true");
                        //$(thn).attr("data-searchable", "true");
                        
                        //$(thn).attr("data-type", "numeric");
                        $(thn).attr("data-header-css-class", "column");
                        //$(thn).addClass("text-center");
                        $(thn).attr("data-formatter", "acciones");
                        $(thn).attr("data-header-css-class", "column");
                        $(thn).text("Acciones");
                        $(trDinamico).prepend(thn);
                        //fin crear columna acciones
                    }
                    if (identificador === "acciones") {
                        $(th).attr("data-formatter", "acciones");
                        $(th).attr("data-header-css-class", "column");
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
    catch(e)
    {
        webServiceContesta = false;
        errorWebService = e.message;
    }
}

function init() {
    var ElementoTFSMapeadoSISU = null;
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
                return "<button type=\"button\" class=\"btn btn-xs btn-link\" data-row-id=\"" + id + "\" onclick=\"mensaje('" + id + "');\"><span class=\"fa fa-pencil\"></span>&nbsp;&nbsp;" + row.IDTicket + "</button>";
            },
            "descripcion": function (column, row) {
                return '<p data-toggle="tooltip" data-placement="auto" title="' + row.Descripcion + '">' + row.Descripcion + '</p>';
            },
            "idTFS": function (column, row) {
                ElementoTFSMapeadoSISU = getFolioTFSBySISUID(IdsTFSyIdsSISU, row.IDTicket);
                if (ElementoTFSMapeadoSISU === null || ElementoTFSMapeadoSISU === undefined || ElementoTFSMapeadoSISU.length === 0) {
                    return "<p>N/A</p>";
                }
                return "<a target=\"_blank\" href=\"http://bot-tfs:8080/tfs/BOT/PDG/_workitems#id=" + ElementoTFSMapeadoSISU[0].idTFS +"&triage=true&_a=edit\" >" + ElementoTFSMapeadoSISU[0].idTFS + "</a>";
            },
            "acciones": function (column, row) {
                ElementoTFSMapeadoSISU = getFolioTFSBySISUID(IdsTFSyIdsSISU, row.IDTicket);
                var nombreSistemaTFS = getSistemaTFSBySISUSistema(sistemas.sistemas, row.Sistema);
                var modulosSistema = new Array();
                var modulosSistemaTFS = new Array();
                if (nombreSistemaTFS === null || nombreSistemaTFS === undefined || nombreSistemaTFS.length === 0) {
                    nombreSistemaTFS = "0";
                }
                else
                {
                    var modulos = nombreSistemaTFS[0].modulossisu;
                    for (var i = 0; i < modulos.length; i++) {
                        modulosSistema.push(modulos[i].toLowerCase());
                    }
                    modulosSistemaTFS = nombreSistemaTFS[0].modulostfs;
                    nombreSistemaTFS = nombreSistemaTFS[0].tfs;
                }
                var indexModulo = modulosSistema.indexOf(row.Modulo.toLowerCase());
                var moduloTFS = modulosSistemaTFS[indexModulo];
                var moduloSISU = modulosSistema[indexModulo];
                if (moduloTFS !== undefined) {
                    if (moduloTFS.toLowerCase() === "otro") {
                        if (arrayModulosGenericos.indexOf(moduloSISU) === -1) {
                            nombreSistemaTFS = "Genéricos";
                            moduloTFS = arrayModulosGenericos[arrayModulosGenericos.indexOf(moduloSISU)];
                        }
                    }
                }
                if (ElementoTFSMapeadoSISU === null || ElementoTFSMapeadoSISU === undefined || ElementoTFSMapeadoSISU.length === 0) {
                    return "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-crearbug\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\" data-row-idtfs=\"" + 0 + "\" data-row-sistematfs=\"" + nombreSistemaTFS + "\" data-row-modulotfs=\"" + moduloTFS + "\"><span class=\"glyphicon glyphicon-flash\" aria-hidden=\"true\"></span></button>" +
                   "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-verDescripcion\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\"><span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button>" +
                        "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-cerrarTicket\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button>";
                }
                return "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-crearbug\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\" data-row-idtfs=\"" + ElementoTFSMapeadoSISU[0].idTFS + "\" data-row-sistematfs=\"" + nombreSistemaTFS + "\" data-row-modulotfs=\"" + moduloTFS + "\"><span class=\"glyphicon glyphicon-flash\" aria-hidden=\"true\"></span></button>" +
                    "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-verDescripcion\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\"><span class=\"glyphicon glyphicon-info-sign\" aria-hidden=\"true\"></span></button>" +
                    "<button type=\"button\" height=\"20\" width=\"20\" class=\"btn btn-xs btn-default command-cerrarTicket\" data-row-id=\"" + row.IDTicket + "\" data-row-descripcion=\"" + row.Descripcion + "\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button>";
            }
        }
    }).on("loaded.rs.jquery.bootgrid", function () {
        /* Executes after data is loaded and rendered */
            
        grid.find(".command-crearbug").on("click", function (e) {
            if ($(this).data("row-idtfs") === 0) {
                clicSistemaTFS = $(this).data("row-sistematfs");
                clicModuloTFS = $(this).data("row-modulotfs");
                clicDescripcion = $(this).data("row-descripcion");
                clicIdSISU = $(this).data("row-id");
                var tempModal = BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_PRIMARY,
                    message: 'Crear bug en Team Foundation Server!',
                    buttons: [{
                        icon: 'glyphicon glyphicon-send',
                        label: 'Crear bug',
                        cssClass: 'btn-primary',
                        autospin: true,
                        action: function (dialogRef) {
                            dialogRef.enableButtons(false);
                            dialogRef.setClosable(false);
                            $.ajax({
                                type: "POST",
                                url: "wsServicio.asmx/CrearBug",
                                data: '{"nombreSistema":"' + clicSistemaTFS + '",' + '"nombreModulo":"' + clicModuloTFS + '",' + '"descripcion":"' + clicDescripcion + '",' + '"idSISU":"' + clicIdSISU + '",' + '"nombreAsignado":"' + nombreRecursoTFS + '"}',
                                async: false,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (result) {
                                    if (result.d.length > 5) {
                                        dialogRef.getModalBody().html('Detalle del error: ' + result.d + '. La ventana se cerrara automaticamente en 5 segundos.');
                                        dialogRef.setType(BootstrapDialog.TYPE_DANGER);
                                    }
                                    else {
                                        if (result.d === "0") {
                                            dialogRef.getModalBody().html('No se pudo crear el bug en el servicio Team Foundation Server, vuelta a intentar o contacte a su administrador. La ventana se cerrara automaticamente en 5 segundos.');
                                            dialogRef.setType(BootstrapDialog.TYPE_DANGER);
                                        }
                                        else {
                                            dialogRef.getModalBody().html('Se ha creado el bug <a target="_blank" href="http://bot-tfs:8080/tfs/BOT/PDG/_workitems#id=' + result.d + '&triage=true&_a=edit">' + result.d + '</a>. La ventana se cerrara automaticamente en 10 segundos.');
                                            IdsTFSyIdsSISU.push({ IdTicket: 0, idSISU: clicIdSISU, idTFS: result.d });
                                            filtro = $(window).data("rows");
                                            $("#grid").bootgrid("clear");
                                            $("#grid").bootgrid("append", filtro);
                                        }
                                    }
                                    setTimeout(function () {
                                        dialogRef.close();
                                    }, 10000);
                                }
                            });
                        }
                    }, {
                        label: 'Close',
                        action: function (dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });
            } else {
                var dialog = BootstrapDialog.alert("Ya tiene un bug asociado <a target=\"_blank\" href=\"http://bot-tfs:8080/tfs/BOT/PDG/_workitems#id=" + $(this).data("row-idtfs") + "&triage=true&_a=edit\" >" + $(this).data("row-idtfs") + "</a>");
                dialog.setType(BootstrapDialog.TYPE_PRIMARY);
                dialog.setTitle("Información");
            }
        }).end().find(".command-verDescripcion").on("click", function (e) {
            var tempModal = BootstrapDialog.alert($(this).data("row-descripcion"));
            tempModal.setType(BootstrapDialog.TYPE_PRIMARY);
            tempModal.setTitle("Descripción");
            tempModal.enableButtons(true);
            tempModal.setClosable(true);
        }).end().find(".command-cerrarTicket").on("click", function (e) {
            var tempModal = BootstrapDialog.show({
                type: BootstrapDialog.TYPE_PRIMARY,
                message: $('<textarea id="respUsuario" class="form-control" style="min-height: 5em; min-width: 100%;" placeholder="Respuesta..."></textarea><br/><textarea id="respInterna" class="form-control" style="min-height: 5em; min-width: 100%;" placeholder="Respuesta Interna..."></textarea>'),
                title: "Responder Ticket",
                data: {
                    'idSISU': $(this).data("row-id"),
                    'usuario': nombreWindows.toUpperCase() + "BO"
                },
                buttons: [{
                    icon: 'glyphicon glyphicon-send',
                    label: ' Cerrar Ticket',
                    cssClass: 'btn-primary',
                    autospin: true,
                    action: function (dialogRef) {
                        dialogRef.enableButtons(false);
                        dialogRef.setClosable(false);
                        $.ajax({
                            type: 'POST',
                            url: "wsServicio.asmx/WebServiceMeridaCerrarTicket",
                            async: false,
                            data: '{"idSISU":"' + dialogRef.getData('idSISU') + '",' + '"usuario":"' + dialogRef.getData('usuario') + '",' + '"respUsuario":"' + $("#respUsuario").val() + '",' + '"respInterna":"' + $("#respInterna").val() + '"}',
                            contentType: "application/json; charset=ISO-8859-1",
                            dataType: "json",
                            success: function (data) {
                                var result = JSON.parse(data.d);
                                if(result.lError.toString() === "true")
                                {
                                    var alertDialog = BootstrapDialog.alert(result.cError);
                                    alertDialog.setType(BootstrapDialog.TYPE_DANGER);
                                    dialogRef.enableButtons(true);
                                    dialogRef.setClosable(true);
                                }
                                else {
                                    var alertDialog = BootstrapDialog.alert(result.cError);
                                    alertDialog.setType(BootstrapDialog.TYPE_SUCCESS);
                                    dialogRef.enableButtons(true);
                                    dialogRef.setClosable(true);
                                }
                            }
                        });
                    }
                }, {
                    label: 'Close',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }]
            });
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
                var Registro = eval("registro." + nombreFiltro).toString().toLowerCase();
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

                            $(ulConversacionesPills).append($('<li><a href="#tab' + iConversacion + '" data-toggle="tab" id="' + iConversacion + '">' + iConversacion + '</a></li>'));

                            var dvElementosHist = $('<div class="tab-pane" id="tab' + iConversacion + '"></div>');
                            var campoHistorial = $('<div class="form-group"></div>');
                            $.each(historialValor, function (clave, valorConversacion) {
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

                            $(dv).append(dvElementosHist);

                            $(dvHistorial).append(dv);
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
                    type: BootstrapDialog.TYPE_PRIMARY,
                    title: "Número de Ticket: " + id,
                    message: dvFormulario,
                    onshow: function (dialog) {
                    }
                });
            }
        });
    } // Fin del try

    catch (e) {
        alert("Ha Ocurrido un error " + e.message);
    }
}