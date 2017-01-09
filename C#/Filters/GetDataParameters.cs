using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rosles.Infrastructure.Filters
{
    public class GetDataParameters: GetParameters
    {
        public static new GetDataParameters Default 
        {
            get
            {
                return new GetDataParameters()
                {
                    Page = 1,
                    Take = 100
                };
            }
        }

        public GetDataParameters()
        {

        }
        
        public DateTime? ActualDate { get; set; }

		public string OrderByField { get; set; }

		public SortOrder SortOrder { get; set; }

		public override bool IsValid()
		{
			return base.IsValid() && Enum.GetValues(typeof(SortOrder)).Cast<SortOrder>().Any(s => s == SortOrder);
		}
    }
}
