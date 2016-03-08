using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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
    public class wsPrueba : System.Web.Services.WebService
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
        public string CrearBug()
        {
            Uri urlProyecto = new Uri("http://bot-tfs:8080/tfs/BLUEOCEAN");
            TeamWrapper oTeam = new TeamWrapper(urlProyecto);
            return oTeam.CrearBug().ToString();
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ObtenerIdsTFS(string IdsSISU)
        {
            List<BugCreado> listaBugs = new List<BugCreado>();
            IEnumerable<int> listaIDsSISU = IdsSISU.Split(',').ToList().Select(z => int.Parse(z));
            using (var ctx = new TicketsDAO.TicketsDBContext())
            {
                listaBugs = ctx.BugCreado.Where(z => listaIDsSISU.Contains(z.idSISU)).ToList();
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(listaBugs);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string HelloWorld2()
        {
            return "";
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string HelloWorld()
        {
            Ticket[] tickets = new Ticket[]
            {
                new Ticket()
                {
                    total_rows = "2",
                    page_data = new DatosTicket[]
                    {
                        new DatosTicket()
                        {
                            id = "1",
                            firstname = "primer ticket",
                            lastname = "aaa",
                            email = "aaa",
                            gender = "aaa"
                        },
                        new DatosTicket()
                        {
                            id = "2",
                            firstname = "segundo ticket",
                            lastname = "bbb",
                            email = "bbb",
                            gender = "bbb"
                        },
                         new DatosTicket()
                        {
                            id = "3",
                            firstname = "primer ticket",
                            lastname = "aaa",
                            email = "aaa",
                            gender = "aaa"
                        },
                          new DatosTicket()
                        {
                            id = "4",
                            firstname = "primer ticket",
                            lastname = "aaa",
                            email = "aaa",
                            gender = "aaa"
                        },
                           new DatosTicket()
                        {
                            id = "5",
                            firstname = "primer ticket",
                            lastname = "aaa",
                            email = "aaa",
                            gender = "aaa"
                        },
                           new DatosTicket()
                        {
                            id = "6",
                            firstname = "primer ticket",
                            lastname = "aaa",
                            email = "aaa",
                            gender = "aaa"
                        },
                        //   new DatosTicket()
                        //{
                        //    id = "7",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "8",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "9",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "10",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "11",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "12",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "13",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "14",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                        //   new DatosTicket()
                        //{
                        //    id = "15",
                        //    firstname = "primer ticket",
                        //    lastname = "aaa",
                        //    email = "aaa",
                        //    gender = "aaa"
                        //},
                    }
                }
            };
            return new JavaScriptSerializer().Serialize(tickets);
            //System.Web.Script.Serialization.JavaScriptSerializer ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            //string strResponse = ser.Serialize(tickets);
            //strResponse = strResponse.TrimEnd(']');
            //strResponse = strResponse.TrimStart('[');
            //this.Context.Response.ContentType = "application/json; charset=utf-8";
            //this.Context.Response.Write(strResponse);
        }
    }
}
