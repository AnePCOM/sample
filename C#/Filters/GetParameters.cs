using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rosles.Infrastructure.Filters
{
	public class GetParameters
	{
        public static GetParameters Default 
        {
            get
            {
                return new GetParameters()
                {
                    Page = 1,
                    Take = 100
                };
            }
        }

        public GetParameters()
        {
        }
        
		public int Skip { get { return (Page - 1) * Take; } }

        public int Take { get; set; }

        public int Page { get; set; }

		public FilterOperations FilterOperation { get; set; }

		public List<Filter> Filters { get; set; }

		public virtual string GetFilterExpression()
		{
			if (Filters != null && Filters.Count > 0)
			{
				string operation = null;
				if (FilterOperation == FilterOperations.And)
				{
					operation = " AND ";
				}
				else if (FilterOperation == FilterOperations.Or)
				{
					operation = " OR ";
				}

				if (operation != null)
				{
					string result = string.Empty;
					foreach (var f in Filters)
					{
						result = result + (!string.IsNullOrEmpty(result) ? operation : "") + f.ToString();
					}

					return result;
				}
			}
			return null;
		}
	
		public virtual bool IsValid()
		{
			return Skip >= 0 && Take > 0 && Enum.GetValues(typeof(FilterOperations)).Cast<FilterOperations>().Any(f => f == FilterOperation) 
				&& (Filters == null || Filters.All(f => f.IsValid()));
		}
	}
}
