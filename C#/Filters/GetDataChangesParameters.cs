using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rosles.Infrastructure.Filters
{
	public class GetDataChangesParameters: GetParameters
	{
        public static new GetDataChangesParameters Default 
        {
            get
            {
                return new GetDataChangesParameters()
                {
                    Page = 1,
                    Take = 100
                };
            }
        }

		public GetDataChangesParameters()
        {

        }

		public DateTime? StartDate { get; set; }
		
		public DateTime? EndDate { get; set; }

		public override bool IsValid()
		{
			return base.IsValid() && (EndDate == null || StartDate == null || EndDate >= StartDate);
		}
	}
}
