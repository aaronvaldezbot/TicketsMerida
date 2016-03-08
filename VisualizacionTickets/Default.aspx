<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" Async="true" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VisualizacionTickets._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <div class="container-fluid">
        <div class="row">

            <%--<div class="tabbable">
                <ul class="nav nav-tabs nav-pills" id="myTab">
                    <li>
                      
                      <a href="#tab2" data-toggle="tab">Part 1</a>
                    </li>
                    <li>
                        <a href="#tab3" data-toggle="tab">Part 1</a>
                    </li>
                    <li>
                        <a href="#tab4" data-toggle="tab">Part 1</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane" id="tab2">aaaaaaaaaaaa</div>
                    <div class="tab-pane" id="tab3">BBBBBBBBBBB</div>
                    <div class="tab-pane" id="tab4">CCCCCCCC</div>
                </div>
            </div>

            <div class="col-md-3 visible-md visible-lg">
                    <div class="affix">
                        Sub Nav
                    </div>
                </div>--%>
            <div class="col-md-12">
                <%--<button id="init" type="button" class="btn btn-default">Init</button>
                    <button id="append" type="button" class="btn btn-default">Append</button>
                    <button id="clear" type="button" class="btn btn-default">Clear</button>
                    <button id="removeSelected" type="button" class="btn btn-default">Remove Selected</button>
                    <button id="destroy" type="button" class="btn btn-default">Destroy</button>
                    <button id="init" type="button" class="btn btn-default">Init</button>
                    <button id="clearSearch" type="button" class="btn btn-default">Clear Search</button>
                    <button id="clearSort" type="button" class="btn btn-default">Clear Sort</button>
                    <button id="getCurrentPage" type="button" class="btn btn-default">Current Page Index</button>
                    <button id="getRowCount" type="button" class="btn btn-default">Row Count</button>
                    <button id="getTotalRowCount" type="button" class="btn btn-default">Total Row Count</button>
                    <button id="getTotalPageCount" type="button" class="btn btn-default">Total Page Count</button>
                    <button id="getSearchPhrase" type="button" class="btn btn-default">Search Phrase</button>
                    <button id="getSortDictionary" type="button" class="btn btn-default">Sort Dictionary</button>
                    <button id="getSelectedRows" type="button" class="btn btn-default">Selected Rows</button>--%>
                <!--div class="table-responsive"-->
                <table class="table table-responsive">
                    <thead>
                        <tr>
                            <th class="text-muted text-center"></th>
                            <th class="text-muted text-center"></th>
                            <th class="text-muted text-center"></th>
                            <th class="text-muted text-left"></th>
                        </tr>
                    </thead>
                    <tbody id="contenedor-filtro">
                        <tr>
                            <td>
                                <span>
                                    <div class="btn-group">
                                        <button type="button" class="form-control btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            Elegir<span class="caret"></span>
                                        </button>
                                        <%--Se llena mediante Li's--%>
                                        <ul class="dropdown-menu nombreFiltro" role="menu">
                                            <%--<li><a href="#">small</a></li>
                                            <li><a href="#">medium</a></li>
                                            <li><a href="#">large</a></li>--%>
                                        </ul>
                                    </div>
                                    <%--<select class="btn btn-xs btn-info nombreFiltro">
                                    </select>--%>
                                </span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="form-control btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                        Elegir<span class="caret"></span>
                                    </button>
                                    <%--Se llena mediante Li's--%>
                                    <ul class="dropdown-menu tipoFiltro" role="menu">
                                    </ul>
                                </div>
                            </td>
                            <td class="campoValor">
                                <span class="campoValorInput">
                                    <span class="campoValorInput">
                                        <input type="text" class="form-control valorFiltro" placeholder="Valor">
                                    </span>
                                </span>
                            </td>
                            <td>
                                <span class="badge badge-error">X</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="modal fade" role="dialog">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                <h4 class="modal-title">Modal title</h4>
                            </div>
                            <div class="modal-body">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                        <!-- /.modal-content -->
                    </div>
                    <!-- /.modal-dialog -->
                </div>
                <!-- /.modal -->
                <div class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
        <p>One fine body…</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
                <div id="filtros">
                    <div id="calendario">
                        <span class="col-sm-6 campoValorInput">
                            <span class="form-group">
                                <span class='input-group date dtpFecha'>
                                    <input type='text' class="form-control valorFiltro" />
                                    <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-calendar"></span>
                                    </span>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div id="appendFiltro">
            </div>
            <div class="form-group">
                <button id="agregaFiltro" type="button" class="btn btn-default">Agregar Filtro</button>
                <button id="btnFiltrar" type="button" class="btn btn-default" onclick="filtrar()">Filtrar</button>
                <button id="btnBorrarFiltros" type="button" class="btn btn-default" onclick="BorrarFiltros()">Limpiar Filtros</button>
            </div>
            <div class="form-group">
                
            </div>
            <table id="grid" class="bootgrid-table table table-responsive table-condensed table-hover table-striped" data-selection="true" data-multi-select="true" data-row-select="true" data-keep-selection="true">
                <thead>
                    <tr id="trdinamico">
                        <%--                        <th data-column-id="registerdate" 
            data-css-class="hidden-xs hidden-sm" 
            data-header-css-class="hidden-xs hidden-sm">Date</th>--%>
                        <%--<th data-column-id="a" data-visible-in-selection="false" data-identifier="true" data-type="numeric" data-align="center" data-width="auto">A</th>
                            <th data-column-id="b" data-searchable="false" data-type="numeric" data-align="center" data-width="auto">B</th>
                            <th data-column-id="c" data-searchable="false" data-type="numeric" data-align="center" data-width="auto">C</th>
                            <th data-column-id="d" data-formatter="commands" data-type="numeric" data-align="center" data-width="auto">D</th>
                            <th data-column-id="e" data-formatter="pix" data-type="numeric" data-align="right" data-width="auto">D</th>
                        --%>
                    </tr>
                </thead>
                <tbody id="tbodyrows">
                </tbody>
            </table>
            <!--/div-->

        </div>
</asp:Content>
