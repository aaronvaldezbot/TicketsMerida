using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using TicketsDominio;

namespace VisualizacionTickets
{
    /// <summary>
    /// Summary description for wsPrueba
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsServicio : System.Web.Services.WebService
    {
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string WebServiceMerida()
        {
            try
            {
                WebRequest request = WebRequest.Create("http://isla.merida.gob.mx/scripts/cgiip.exe/WService=wsSISU/TicketsEscalados.r");
                string jsonData = string.Empty;
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded; charset=ISO-8859-1";
                string postData = "{\"data\":\"" + "0" + "\"}"; //encode your data 
                                                                //using the javascript serializer

                //get a reference to the request-stream, and write the postData to it
                using (Stream s = request.GetRequestStream())
                {
                    using (StreamWriter sw = new StreamWriter(s))
                        sw.Write(postData);
                }

                //get response-stream, and use a streamReader to read the content
                using (Stream s = request.GetResponse().GetResponseStream())
                {
                    using (StreamReader sr = new StreamReader(s, Encoding.GetEncoding("ISO-8859-1")))
                    {
                        Encoding iso = Encoding.GetEncoding("ISO-8859-1");
                        byte[] isoBytes = iso.GetBytes(sr.ReadToEnd());
                        jsonData = iso.GetString(isoBytes);
                    }
                }
                return jsonData;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string WebServiceMeridaCerrarTicket(int idSISU, string usuario, string respUsuario, string respInterna)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create("http://isla.merida.gob.mx/scripts/cgiip.exe/WService=wsSISU/TicketsResp.r");

                var postData = "folio=" + idSISU;
                postData += "&estatus=ESP";
                postData += "&respUsuario=" + respUsuario;
                postData += "&respInterna=" + respInterna;
                postData += "&usuario=" + usuario;
                var data = Encoding.ASCII.GetBytes(postData);

                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = data.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }

                var response = (HttpWebResponse)request.GetResponse();

                var responseString = new StreamReader(response.GetResponseStream(), Encoding.GetEncoding("ISO-8859-1")).ReadToEnd();
                return responseString;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string CrearBug(string nombreSistema, string nombreModulo, string descripcion, int idSISU, string nombreAsignado)
        {
            Uri urlProyecto = new Uri("http://bot-tfs:8080/tfs/BLUEOCEAN");
            TeamWrapper oTeam = new TeamWrapper(urlProyecto);
            return oTeam.CrearBug(nombreSistema, nombreModulo, descripcion, idSISU, nombreAsignado).ToString();
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ObtenerIdsTFS(string IdsSISU)
        {
            try
            {
                List<BugCreado> listaBugs = new List<BugCreado>();
                if (IdsSISU.Length > 0)
                {
                    IEnumerable<int> listaIDsSISU = IdsSISU.Split(',').ToList().Select(z => int.Parse(z));
                    using (var ctx = new TicketsDAO.TicketsDBContext())
                    {
                        listaBugs = ctx.BugCreado.Where(z => listaIDsSISU.Contains(z.idSISU)).ToList();
                    }
                }
                return Newtonsoft.Json.JsonConvert.SerializeObject(listaBugs);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string HelloWorld2()
        {
            return "";
        }
    }
}
