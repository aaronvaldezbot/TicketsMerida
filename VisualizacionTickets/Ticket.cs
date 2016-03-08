using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VisualizacionTickets
{
    public class Ticket
    {
        public string total_rows { get; set; }
        public DatosTicket[] page_data { get; set; }

    
    }
    public class DatosTicket
    {
        public string id { get; set; }
        public string lastname { get; set; }
        public string firstname { get; set; }
        public string email { get; set; }
        public string gender { get; set; }
    }
}
