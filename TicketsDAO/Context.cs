using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsDominio;

namespace TicketsDAO
{
    public class TicketsDBContext : DbContext
    {
        public TicketsDBContext()
            : base("name=TicketsDBConnectionString")
        {
        }
        public DbSet<BugCreado> BugCreado { get; set; }
    }
}
