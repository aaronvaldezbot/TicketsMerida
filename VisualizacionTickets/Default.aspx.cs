using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using VisualizacionTickets.ServiceReference1;
using WebApplication1;

namespace VisualizacionTickets
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Title = "Visualización Tickets";
        }

        [WebMethod]
        public static string regresaListado()
        {
            try
            {

                Objeto objetoJSON = new Objeto();
                IService1 ConectorServicioWeb = new Service1Client();
                var servicioWebJson = ConectorServicioWeb.GetData(10);
                dynamic c = JsonConvert.DeserializeObject(servicioWebJson);
                objetoJSON.total = c[0];
                objetoJSON.rows = JsonConvert.SerializeObject(c[1]);
                objetoJSON.current = "1";
                objetoJSON.rowCount = c[1].Count.ToString();
                return JsonConvert.SerializeObject(objetoJSON);
            }
            catch
            {
                return null;
            }
        }
    }
}