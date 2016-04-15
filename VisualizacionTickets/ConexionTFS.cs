using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using Microsoft.TeamFoundation.Client;
using Microsoft.TeamFoundation.Framework.Client;
using Microsoft.TeamFoundation.Framework;
using Microsoft.TeamFoundation.Server;
using Microsoft.TeamFoundation.Framework.Common;
using System.Collections.ObjectModel;
using Microsoft.TeamFoundation.WorkItemTracking.Client;
using System.Collections;
using TicketsDAO;
using System.Data.Entity;
using System.Data;
using TicketsDominio;

namespace VisualizacionTickets
{
    public class TeamWrapper : IDisposable
    {
        private readonly TfsTeamProjectCollection teamProjectCollection;
        private readonly TfsTeamService teamService;
        private readonly ProjectInfo projectInfo;
        private readonly IIdentityManagementService2 identityManagementService;
        TfsConfigurationServer configServer;
        WorkItemStore store;

        public TeamWrapper(Uri collectionUri)
            : this(collectionUri, null)
        {
        }

        public string CrearBug(string nombreSistema, string nombreModulo, string descripcion, int idSISU, string nombreAsignado)
        {
            try {
                teamProjectCollection.Authenticate();
                teamProjectCollection.EnsureAuthenticated();
                if(nombreSistema == "0")
                {
                    nombreSistema = "Sin Especificar";
                }
                if(nombreModulo == "undefined")
                {
                    nombreModulo = "Sin Especificar";
                }
                WorkItemType wiType = store.Projects["PRUEBASIAC"].WorkItemTypes["Bug"];
                WorkItem newWI = new WorkItem(wiType);
                newWI.Title = idSISU.ToString() + " Creación Automática desde APP Tickets";
                newWI.State = "Proposed";
                newWI.Fields["System.AssignedTo"].Value = nombreAsignado;
                newWI.Fields["Microsoft.VSTS.CMMI.Symptom"].Value = descripcion;
                newWI.Fields["BlueOcean.MainREQ.Sistema"].Value = nombreSistema;
                newWI.Fields["BlueOcean.MainREQ.Modulo"].Value = nombreModulo;
                newWI.Fields["Tags"].Value = "SISU";
                newWI.Fields["BlueOcean.Pruebas.Navegadores"].Value = "Todos";
                newWI.Fields["BlueOcean.Comun.VersionProducto"].Value = "4.6.0";
                newWI.Fields["BlueOcean.MainREQ.Cliente"].Value = "Ayuntamiento de Mérida";
                newWI.Fields["BlueOcean.MainREQ.Origen"].Value = "Cliente";
                newWI.Fields["BlueOcean.Test.RequireTestIn"].Value = "Creado Automáticamente desde APP Tickets";
                //Faltan campos obligatorios
                newWI.Save();
                using (var ctx = new TicketsDBContext())
                {
                    BugCreado oBug = new BugCreado();
                    oBug.idSISU = idSISU;
                    oBug.idTFS = newWI.Id;
                    ctx.BugCreado.Add(oBug);
                    ctx.SaveChanges();
                }
                return newWI.Id.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public List<string> ObtenerColecciones(Uri uUri)
        {
            List<string> ListaColecciones = new List<string>();
            try
            {
                ReadOnlyCollection<CatalogNode> collectionNodes = configServer.CatalogNode.QueryChildren(
                new[] { CatalogResourceTypes.ProjectCollection },
                false, CatalogQueryOptions.None);

                foreach (CatalogNode collectionNode in collectionNodes)
                {
                    Guid collectionId = new Guid(collectionNode.Resource.Properties["InstanceId"]);
                    TfsTeamProjectCollection teamProjectCollection = configServer.GetTeamProjectCollection(collectionId);
                    Console.WriteLine("Collection: " + teamProjectCollection.Name);

                    ListaColecciones.Add(teamProjectCollection.Name);
                }
            }
            catch (Exception ex)
            {
                //MyApplicationContext.Excepcion = ex;
            }
            return ListaColecciones;
        }

        public List<string> ObtenerProyectos(Uri uUri, string cColeccion)
        {
            List<string> ListaProyectos = new List<string>();
            
            ReadOnlyCollection<CatalogNode> collectionNodes = configServer.CatalogNode.QueryChildren(
            new[] { CatalogResourceTypes.ProjectCollection },
            false, CatalogQueryOptions.None);

            CatalogNode collectionNode = collectionNodes.Select(z => z).Where(y => y.Resource.DisplayName == cColeccion).First();
            Guid collectionId = new Guid(collectionNode.Resource.Properties["InstanceId"]);
            TfsTeamProjectCollection teamProjectCollection = configServer.GetTeamProjectCollection(collectionId);

            ReadOnlyCollection<CatalogNode> projectNodes = collectionNode.QueryChildren(
            new[] { CatalogResourceTypes.TeamProject },
            false, CatalogQueryOptions.None);


            foreach (CatalogNode projectNode in projectNodes)
            {
                Console.WriteLine("Team Project: " + projectNode.Resource.DisplayName);
                ListaProyectos.Add(projectNode.Resource.DisplayName);
            }

            return ListaProyectos;
        }

        public List<string> ObtenerIteraciones(string projectName)
        {
            List<string> listaIteraciones = new List<string>();
            var proyecto = store.Projects.Cast<Project>().Where(project => string.Compare(project.Name, projectName, StringComparison.OrdinalIgnoreCase) == 0).Select(z => z).First();
            foreach (Node node in proyecto.IterationRootNodes)
            {
                var path = proyecto.Name + "\\" + node.Name;
                listaIteraciones.Add(path);
                RecursiveAddIterationPath(node, listaIteraciones, path);
            }
            return listaIteraciones;
        }

        private static void RecursiveAddIterationPath(Node node, List<string> listaIteraciones, string parentIterationName)
        {
            foreach (Node item in node.ChildNodes)
            {
                var path = parentIterationName + "\\" + item.Name;
                listaIteraciones.Add(path);
                if (item.HasChildNodes)
                {
                    RecursiveAddIterationPath(item, listaIteraciones, path);
                }
            }
        }

        //public List<VistaGridReporteDiario> ConsultarReporteDiario(string cProyecto, string iteracion)
        //{
        //    string wiql =
        //                string.Format(
        //                    "SELECT [System.Id], [System.AssignedTo], [Microsoft.VSTS.Scheduling.CompletedWork] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Task' AND [System.IterationPath] UNDER '{1}'", cProyecto, iteracion);
        //    WorkItemCollection items = store.Query(wiql);

        //    if (items.Count > 0)
        //    {
        //        var testItemCollectionList = (from WorkItem mItem in items select mItem).ToList();
        //        List<VistaGridReporteDiario> listaVistaGrid = new List<VistaGridReporteDiario>();
        //        var ordenados = (from itemsOrdenados in testItemCollectionList
        //            group itemsOrdenados by itemsOrdenados.Fields["Assigned To"].Value
        //            into grupoOrdenado
        //            select new
        //            {
        //                Persona = grupoOrdenado.Key.ToString(),
        //                TiempoEstimado = grupoOrdenado.Sum(z => Convert.ToDouble(z.Fields["Original Estimate"].Value)),
        //                TiempoCompletado = grupoOrdenado.Sum(z => Convert.ToDouble(z.Fields["Completed Work"].Value)),
        //                TiempoRestante = grupoOrdenado.Sum(z => Convert.ToDouble(z.Fields["Remaining Work"].Value))
        //            });
        //        foreach (var elementoAgrupado in ordenados)
        //        {
        //            VistaGridReporteDiario eVistaGrid = new VistaGridReporteDiario();
        //            eVistaGrid.nombreRecurso = elementoAgrupado.Persona;
        //            eVistaGrid.tiempoCompletado = elementoAgrupado.TiempoCompletado;
        //            eVistaGrid.tiempoEstimado = elementoAgrupado.TiempoEstimado;
        //            eVistaGrid.tiempoRestante = elementoAgrupado.TiempoRestante;
        //            listaVistaGrid.Add(eVistaGrid);
        //        }
        //        return listaVistaGrid;
        //    }
        //    return null;
        //}

        //public List<ReqyTask> ConsultarTrabajoPendiente(string cProyecto, string cUsuario, string cSprint, int iTipo, ref List<int> ListaElementosActivos)
        //{
        //    store = (WorkItemStore)teamProjectCollection.GetService(typeof(WorkItemStore));
        //    string wiql = string.Empty;
        //    switch(iTipo)
        //    //switch (MyApplicationContext.cFiltroBusquedaElementos)
        //    {
        //        case 1:
        //            wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}' AND [System.IterationPath] = '{1}'  AND  [System.WorkItemType] = 'Task' AND State <> 'Closed' Order By State", cProyecto, cSprint);
        //            //wiql = string.Format("SELECT [System.Id] FROM WorkItemLinks WHERE([Source].[System.WorkItemType] = 'Requirement') And([System.Links.LinkType] = 'Child') And([Target].[System.State] = 'Active') mode(MustContain)", cProyecto);
        //            //                    wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Task' AND [Assigned To] = '{1}' AND State <> 'Closed' Order By State", cProyecto, cUsuario);
        //            break;
        //        case 2:
        //            wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}' AND [System.IterationPath] = '{1}'  AND  [System.WorkItemType] = 'Task' AND State <> 'Closed' AND [Assigned To] = '{2}' Order By State", cProyecto, cSprint, cUsuario);
        //            //wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Task' AND [Assigned To] = '{1}' AND State <> 'Closed' AND [System.Id] = {2} Order By State", cProyecto, cUsuario, "todo"/*MyApplicationContext.cIdBusquedaElementoTFS*/);
        //            break;
        //        default:
        //            wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Task' AND [Assigned To] = '{1}' AND State <> 'Closed' AND State = '{2}' Order By State", cProyecto, cUsuario, "todo"/*MyApplicationContext.cFiltroBusquedaElementos*/);
        //            break;
        //    }
        //    List<ReqyTask> listaElementosPendientes = new List<ReqyTask>();
        //    Query query = new Query(store, wiql);
        //    //WorkItemCollection numWorkItems = query.RunQuery();
        //    WorkItemCollection items = store.Query(wiql);
        //    if (items.Count > 0)
        //    {
        //        System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)items.GetEnumerator();
        //        while (enumerator.MoveNext())
        //        {
        //            WorkItem item = (WorkItem)enumerator.Current;
        //            foreach(WorkItemLink oWILink in item.WorkItemLinks)
        //            {
        //                if(oWILink.LinkTypeEnd.Name == "Parent")
        //                {
        //                    WorkItem oWorkItemRelacionado = this.ObtenerElementoDeTrabajo(oWILink.TargetId);
        //                    ReqyTask oReqyTask = new ReqyTask();
        //                    oReqyTask.idREQ = oWILink.TargetId;
        //                    oReqyTask.tituloREQ = oWorkItemRelacionado.Title;
        //                    oReqyTask.estadoREQ = oWorkItemRelacionado.State;
        //                    oReqyTask.nombreVinculo = oWorkItemRelacionado.Type.Name;
        //                    oReqyTask.idTASK = oWILink.SourceId;
        //                    oReqyTask.tituloTASK = item.Title;
        //                    oReqyTask.estadoTASK = item.State;
        //                    oReqyTask.asignadoTASK = item.Fields["Assigned To"].Value.ToString();
        //                    oReqyTask.tiempoRestanteTASK = Convert.ToDecimal(item.Fields["Remaining Work"].Value ?? "0");
        //                    oReqyTask.tiempoOriginalTASK = Convert.ToDecimal(item.Fields["Original Estimate"].Value ?? "0");
        //                    oReqyTask.tiempoCompletadoTASK = Convert.ToDecimal(item.Fields["Completed Work"].Value ?? "0");
        //                    switch (oWorkItemRelacionado.Type.Name)
        //                    {
        //                        case "Requirement":
        //                            oReqyTask.claseEtiqueta = "primary";
        //                            break;
        //                        case "Bug":
        //                            oReqyTask.claseEtiqueta = "danger";
        //                            break;
        //                    }
        //                    switch (oReqyTask.estadoREQ)
        //                    {
        //                        case "Proposed":
        //                            oReqyTask.claseEtiquetaEstado = "warning";
        //                            break;
        //                        case "Active":
        //                            oReqyTask.claseEtiquetaEstado = "success";
        //                            break;
        //                        case "Resolved":
        //                            oReqyTask.claseEtiquetaEstado = "info";
        //                            break;
        //                        case "Closed":
        //                            oReqyTask.claseEtiquetaEstado = "default";
        //                            break;
        //                    }
        //                    listaElementosPendientes.Add(oReqyTask);
        //                    //listaElementosPendientes.Add(new Tuple<int, string, string, string, int, string, string>(oWILink.TargetId, oWorkItemRelacionado.Title, oWorkItemRelacionado.State, oWorkItemRelacionado.Type.Name, oWILink.SourceId, item.Title, item.State));
        //                }
        //            }
        //            if(item.State == "Active")
        //            {
        //                ListaElementosActivos.Add(item.Id);
        //            }
        //        }
        //    }
        //    return listaElementosPendientes;
        //}

        public List<string> ConsultarBugsPendientes(string cProyecto, string cUsuario, ref List<int> ListaBugsPendientes)
        {
            string wiql = string.Empty;
            switch ("")
            //switch (MyApplicationContext.cFiltroBusquedaElementos)
            {
                case "":
                    wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Bug' AND [Assigned To] = '{1}' AND State <> 'Closed' Order By State", cProyecto, cUsuario);
                    break;
                case "Por ID":
                    wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Bug' AND [Assigned To] = '{1}' AND State <> 'Closed' AND [System.Id] = {2} Order By State", cProyecto, cUsuario, "todo" /*MyApplicationContext.cIdBusquedaElementoTFS*/);
                    break;
                default:
                    wiql = string.Format("SELECT [System.Id] FROM WorkItems WHERE [System.TeamProject] = '{0}'   AND  [System.WorkItemType] = 'Bug' AND [Assigned To] = '{1}' AND State <> 'Closed' AND State = '{2}' Order By State", cProyecto, cUsuario, "todo" /*MyApplicationContext.cFiltroBusquedaElementos*/);
                    break;
            }
            List<string> listaElementosPendientes = new List<string>();
            WorkItemCollection items = store.Query(wiql);
            if (items.Count > 0)
            {
                System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)items.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    WorkItem item = (WorkItem)enumerator.Current;
                    listaElementosPendientes.Add(item.Id + " - " + item.Title + " - " + item.State);
                    if (item.State == "Active")
                    {
                        ListaBugsPendientes.Add(item.Id);
                    }
                }
            }
            return listaElementosPendientes;
        }

        public void ObtenerRequerimientosGridPrincipal(string wiql)
        {
            WorkItemCollection items = store.Query(wiql);
            if (items.Count > 0)
            {
                System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)items.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    WorkItem item = (WorkItem)enumerator.Current;
                    
                }
            }
        }

        public void ObtenerRequerimientosRelacionados(string wiql)
        {
            WorkItemCollection items = store.Query(wiql);
            if (items.Count > 0)
            {
                System.Collections.IEnumerator enumerator = (System.Collections.IEnumerator)items.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    WorkItem item = (WorkItem)enumerator.Current;
                    Microsoft.TeamFoundation.WorkItemTracking.Client.LinkCollection LinksRequerimiento = item.Links.WorkItem.Links;
                    foreach (Microsoft.TeamFoundation.WorkItemTracking.Client.ExternalLink LinkRequerimiento in LinksRequerimiento.OfType<Microsoft.TeamFoundation.WorkItemTracking.Client.ExternalLink>())
                    {
                        string cWi = string.Empty;
                        if (LinkRequerimiento.LinkedArtifactUri.Contains("Changeset"))
                        {
                            cWi = LinkRequerimiento.LinkedArtifactUri;
                            string[] cWiArray = cWi.Split('/');
                        }
                    }
                    foreach (Microsoft.TeamFoundation.WorkItemTracking.Client.RelatedLink LinkRequerimiento in LinksRequerimiento.OfType<Microsoft.TeamFoundation.WorkItemTracking.Client.RelatedLink>())
                    {
                        int iIdWi = LinkRequerimiento.RelatedWorkItemId;
                        Microsoft.TeamFoundation.WorkItemTracking.Client.WorkItem oWiRelated = store.GetWorkItem(iIdWi);
                    }
                    foreach (Microsoft.TeamFoundation.WorkItemTracking.Client.Hyperlink LinkRequerimiento in LinksRequerimiento.OfType<Microsoft.TeamFoundation.WorkItemTracking.Client.Hyperlink>())
                    {
                        string cWi = LinkRequerimiento.Location;
                        string[] cWiArray = LinkRequerimiento.Location.Split('/');
                    }
                }
            }
        }

        public List<string> ObtenerTiemposTarea(int iIdTarea)
        {
            List<string> ListaTiempos = new List<string>();
            WorkItemStore workItemStore = teamProjectCollection.GetService<WorkItemStore>();
            if (iIdTarea != 0)
            {
                WorkItem workItem = workItemStore.GetWorkItem(iIdTarea);
                if (workItem.Fields["Original Estimate"].Value != null)
                {
                    ListaTiempos.Add(workItem.Fields["Original Estimate"].Value.ToString());
                }
                else
                {
                    ListaTiempos.Add("0.0");
                }
                if (workItem.Fields["Remaining Work"].Value != null)
                {
                    ListaTiempos.Add(workItem.Fields["Remaining Work"].Value.ToString());
                }
                else
                {
                    ListaTiempos.Add("0.0");
                }
                if (workItem.Fields["Completed Work"].Value != null)
                {
                    ListaTiempos.Add(workItem.Fields["Completed Work"].Value.ToString());
                }
                else
                {
                    ListaTiempos.Add("0.0");
                }
                ListaTiempos.Add(workItem.Fields["State"].Value.ToString());
            }
            else
            {
                ListaTiempos.Add("0.0");
                ListaTiempos.Add("0.0");
                ListaTiempos.Add("0.0");
            }
            return ListaTiempos;
        }

        public void ActualizarEstatusTarea(int iIdTarea, string cEstatusNuevo)
        {
            WorkItemStore workItemStore = teamProjectCollection.GetService<WorkItemStore>();
            WorkItem workItem = workItemStore.GetWorkItem(iIdTarea);
            try
            {
                if (workItem.IsValid())
                {
                    workItem.Fields["State"].Value = cEstatusNuevo;
                    workItem.Save();
                }
            }
            catch (ValidationException exception)
            {
                Console.WriteLine("El elemento de trabajo lanzo una excepción.");
                Console.WriteLine(exception.Message);
            }
        }

        public WorkItem ObtenerElementoDeTrabajo(int iIdTarea)
        {
            WorkItemStore workItemStore = teamProjectCollection.GetService<WorkItemStore>();
            return workItemStore.GetWorkItem(iIdTarea);
        }

        public void ActualizarTiemposTarea(ref WorkItem oElementoDeTrabajo, float dHoras, float dMinutos, float dRemainingWork, bool lRemainingManual, string cMotivoAjusteTiempo, bool lPasarAResuelto)
        {
            WorkItemStore workItemStore = teamProjectCollection.GetService<WorkItemStore>();
            WorkItem workItem = oElementoDeTrabajo;
            decimal dEsfuerzoTarea = (decimal) ((dMinutos / 60) + dHoras);
            decimal dTiempoRestanteTFS = 0.0m;
            if (workItem.Fields["Completed Work"].Value != null)
            {
                dTiempoRestanteTFS = Convert.ToDecimal(workItem.Fields["Remaining Work"].Value) - dEsfuerzoTarea;
            }
            if (dTiempoRestanteTFS <= 0.0m)
            {
                dTiempoRestanteTFS = 0.0m;
            }
            dEsfuerzoTarea = Convert.ToDecimal(workItem.Fields["Completed Work"].Value) + (decimal) dEsfuerzoTarea;
            if (lRemainingManual)
            {
                workItem.Fields["Remaining Work"].Value = dRemainingWork;
                dTiempoRestanteTFS = (decimal) dRemainingWork;
            }
            if(lPasarAResuelto)
            {
                workItem.Fields["State"].Value = "Resolved";
            }
            if (workItem.IsDirty)
                Console.WriteLine("El elemento de trabajo ha cambiado pero no se ha guardado.");

            if (workItem.IsValid() == false)
                Console.WriteLine("El elemento de trabajo no es valido.");

            if (workItem.Fields["Completed Work"].IsValid == false)
                Console.WriteLine("El valor del campo 'Completed Work' no es valido.");
            try
            {
                if (workItem.IsValid())
                {
                    workItem.Fields["Completed Work"].Value = dEsfuerzoTarea;
                    workItem.Fields["Remaining Work"].Value = dTiempoRestanteTFS;
                    if (string.IsNullOrWhiteSpace(cMotivoAjusteTiempo))
                    { }
                    else
                    {
                        workItem.Fields["History"].Value = cMotivoAjusteTiempo;
                    }
                    workItem.Save();
                }
                oElementoDeTrabajo = workItem;
            }
            catch (ValidationException exception)
            {
                Console.WriteLine("El elemento de trabajo lanzo una excepción.");
                Console.WriteLine(exception.Message);
            }
        }

        public TeamWrapper(Uri collectionUri, string teamProjectName)
        {
            try
            {
                this.teamProjectCollection = new TfsTeamProjectCollection(collectionUri);
                this.teamService = this.teamProjectCollection.GetService<TfsTeamService>();
                this.identityManagementService = this.teamProjectCollection.GetService<IIdentityManagementService2>();
                ICommonStructureService4 cssService = this.teamProjectCollection.GetService<ICommonStructureService4>();
                this.configServer = TfsConfigurationServerFactory.GetConfigurationServer(collectionUri);
                this.store = (WorkItemStore)teamProjectCollection.GetService(typeof(WorkItemStore));
                if (!string.IsNullOrWhiteSpace(teamProjectName))
                {
                    this.projectInfo = cssService.GetProjectFromName(teamProjectName);
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                //MyApplicationContext.Excepcion = ex;
            }
        }

        public void Dispose()
        {
            this.teamProjectCollection.Dispose();
        }

        public List<string> ListTeams()
        {
            var teams = this.teamService.QueryTeams(this.projectInfo.Uri);
            return (from t in teams select t.Name).ToList();
        }

        public List<string> ListTeamMembers(string team, out string message)
        {
            List<string> lst = null;
            message = string.Empty;
            TeamFoundationTeam t = this.teamService.ReadTeam(this.projectInfo.Uri, team, null);
            if (t == null)
            {
                message = "Team [" + team + "] not found";
            }
            else
            {
                lst = new List<string>();
                foreach (TeamFoundationIdentity i in t.GetMembers(this.teamProjectCollection, MembershipQuery.Expanded))
                {
                    lst.Add(i.DisplayName);
                }
            }

            return lst;
        }

        public string GetDefaultTeam(out string message)
        {
            message = string.Empty;
            string defaultTeamName = null;

            TeamFoundationTeam t = this.teamService.GetDefaultTeam(this.projectInfo.Uri, null);
            if (t == null)
            {
                message = "No default team found ";
            }
            else
            {
                defaultTeamName = t.Name;
            }

            return defaultTeamName;
        }

        private static byte[] ConvertAndResizeImage(byte[] bytes)
        {
            if ((bytes == null) || (bytes.Length < 1))
            {
                throw new ArgumentException("The file could not be found.");
            }

            if (bytes.Length > 0x400000)
            {
                throw new ArgumentException("The file is too large to be used as profile image.");
            }

            using (var imageStream = new MemoryStream(bytes))
            using (Image image = Image.FromStream(imageStream))
            {
                int width = 0x90;
                int height = 0x90;
                if (image.Height > image.Width)
                {
                    width = (0x90 * image.Width) / image.Height;
                }
                else
                {
                    height = (0x90 * image.Height) / image.Width;
                }

                int x = (0x90 - width) / 2;
                int y = (0x90 - height) / 2;
                using (Bitmap bitmap = new Bitmap(0x90, 0x90))
                {
                    using (Graphics graphics = Graphics.FromImage(bitmap))
                    {
                        graphics.DrawImage(image, x, y, width, height);
                    }

                    using (MemoryStream stream = new MemoryStream())
                    {
                        bitmap.Save(stream, ImageFormat.Png);
                        return stream.ToArray();
                    }
                }
            }
        }
    }
}