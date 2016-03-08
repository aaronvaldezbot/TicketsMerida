<%@ Page Title="Contact" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Contact.aspx.cs" Inherits="VisualizacionTickets.Contact" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: Title %>.</h2>
    <h3>Departamento de Innovación</h3>
    <address>
        Calle 18 Num 103<br />
        por 23 y 25 Colonia: México<br />
        <abbr title="Phone">P:</abbr>
        926-10-20
    </address>

    <address>
        <strong>Soporte:</strong>   <a href="mailto:aaron.valdez@blueoceantech.com.mx">aaron.valdez@blueoceantech.com.mx</a><br />
        <!--<strong>Marketing:</strong> <a href="mailto:Marketing@example.com">Marketing@example.com</a> -->
    </address>
</asp:Content>
