using Rosles.Domain.Enums;
using Rosles.Domain.Mappings;
using Rosles.Infrastructure.Core;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rosles.Infrastructure.Filters
{
	public class Filter
	{
		public string FieldId { get; set; }

		public int FilterOperatorId { get; set; }

		public string[] Values { get; set; }

		public override string ToString()
		{
			using (var unitOfWork = ObjectFactory.GetInstance<IUnitOfWork>())
			{
				var repo = unitOfWork.Repository<FilterOperator>();
				var filterOperator = repo.GetById(FilterOperatorId);
				if (filterOperator != null)
				{
					string resultValue = "";
					int valuesCount = ((FilterOperationFlags)filterOperator.Flags & FilterOperationFlags.MultipleValues) == FilterOperationFlags.MultipleValues ? Values.Length : 1;

					string escapeChar = "";
					for (int i = 0; i < valuesCount; i++)
					{
						if (i > 0)
						{
							resultValue += ",";
							escapeChar = "";
						}
						decimal tmp;
						if ((((FilterOperationFlags)filterOperator.Flags & FilterOperationFlags.EscapeValues) == FilterOperationFlags.EscapeValues)
							&&
							(
								((FilterOperationFlags)filterOperator.Flags & FilterOperationFlags.EscapeNumbers) == FilterOperationFlags.EscapeNumbers
									|| !decimal.TryParse(Values[i], out tmp)
							))
						{
							escapeChar = "'";
						}
						resultValue += escapeChar + Values[i] + escapeChar;
					}

					return string.Format(filterOperator.FilterFormat, FieldId, resultValue, string.Empty);
				}
			}

			return base.ToString();
		}
	
		public bool IsValid()
		{
			return !string.IsNullOrEmpty(FieldId) && FilterOperatorId > 0 && Values != null && Values.Length > 0;
		}
	}
}
