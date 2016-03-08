using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsDAO
{
    public class TicketsDBInitializer : DropCreateDatabaseAlways<TicketsDBContext>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        protected override void Seed(TicketsDBContext context)
        {
            base.Seed(context);
        }
    }
}
