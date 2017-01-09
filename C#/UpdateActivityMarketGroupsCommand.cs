using System.Collections.Generic;

namespace Hermes.Api.Activities.Commands
{
	using System;
	using System.Data.Entity;
	using System.Linq;
	using Activities.Dtos;
	using Domain;
	using Domain.Enums;
	using Domain.Models.Activities.MarketGroup;
	using Shared.Extensions;

	public class UpdateActivityMarketGroupsCommand
	{
		private readonly IRepository _repository;

		public UpdateActivityMarketGroupsCommand(IRepository repository)
		{
			_repository = repository;
		}

		public long Execute(UpdateActivityDto activityDto)
		{
			if (activityDto.Pharmacy == null)
				return activityDto.ActivityId;

			AddNewMarketGroups(activityDto);

			DeleteMarketGroups(activityDto);

            foreach (var item in activityDto.Pharmacy.ActivityMarketGroupDtoItems.Where(c => c.State == ObjectState.Edit))
			{
				var changeItem = _repository.Queryable<ActivityMarketGroup>().SingleOrDefault(c => c.Id == item.Id);
				if (changeItem == null) continue;
				changeItem.Name = item.Name;
				changeItem.Description = item.Description;
				_repository.LocalOrAttach(changeItem);
			}


		    if (activityDto.Pharmacy.CheckedOrganizations != null)
		    {
                var modifyMarketGroupsDtos = activityDto.Pharmacy.ActivityMarketGroupDtoItems.Where(c => c.State != ObjectState.Create && c.State != ObjectState.Delete).ToList();
                var modifyMarketGroupsIds = modifyMarketGroupsDtos.Select(x => x.Id).ToList();
                _repository.RemoveAll(_repository.Queryable<ActivityMarketGroupOrganization>().Where(x => modifyMarketGroupsIds.Contains(x.ActivityMarketGroupId)).ToList());

		        var addCheckedOrganizationsItems = (from checkedOrganizationsItem in activityDto.Pharmacy.CheckedOrganizations 
                                                    where modifyMarketGroupsIds.Contains(checkedOrganizationsItem.ActivityMarketGroupId) 
                                                    select new ActivityMarketGroupOrganization()
                                                    {
                                                        ActivityMarketGroupId = checkedOrganizationsItem.ActivityMarketGroupId, 
                                                        OrganizationId = checkedOrganizationsItem.OrganizationsId
                                                    }).ToList();
		        _repository.AddAll(addCheckedOrganizationsItems);
		    }
			_repository.Save();
			return activityDto.ActivityId;
		}

		private void AddNewMarketGroups(UpdateActivityDto activityDto)
		{
			var pharmaciesTabDto = activityDto.Pharmacy;

			var newMarketGroupsDtos = pharmaciesTabDto
				.ActivityMarketGroupDtoItems
				.Where(c => c.State == ObjectState.Create && !String.IsNullOrEmpty(c.Name.Trim()))
				.ToList();

			foreach (var newMarketGroupDtos in newMarketGroupsDtos)
			{
				var frontId = newMarketGroupDtos.Id;

				var newActivityMarketGroup = new ActivityMarketGroup
				{
					ActivityId = activityDto.ActivityId,
					Name = newMarketGroupDtos.Name,
					Description = newMarketGroupDtos.Description
				};

                _repository.Add<ActivityMarketGroup>(newActivityMarketGroup);
                _repository.Save();
				if (pharmaciesTabDto.CheckedOrganizations.IsEmpty() == false)
				{
				    var activityMarketGroupId = newActivityMarketGroup.Id;
					var organizationsOfNewMarketGroup = pharmaciesTabDto
						.CheckedOrganizations
						.Where(c => c.ActivityMarketGroupId == frontId)
						.ToList();

                    _repository.AddAll<ActivityMarketGroupOrganization>(organizationsOfNewMarketGroup
						.Select(x => new ActivityMarketGroupOrganization
						{
							ActivityMarketGroupId = activityMarketGroupId,
							OrganizationId = x.OrganizationsId
						}).ToList());


                    foreach (var checkedOrganizationsItem in pharmaciesTabDto.CheckedOrganizations.Where(x => x.ActivityMarketGroupId == frontId))
                    {
                        checkedOrganizationsItem.ActivityMarketGroupId = activityMarketGroupId;
                    }

                    _repository.Save();
				}

				if (activityDto.Conditions == null)
					continue;

				var activityIndicatorCheckDtos = activityDto
					.Conditions
					.ActivityIndicatorList
                    .Where(x => x.CheckedActivityIndicator != null)
					.SelectMany(x => x.CheckedActivityIndicator)
					.Where(x => x.ActivityMarketGroupId == frontId)
					.ToList();

				activityIndicatorCheckDtos.ForEach(x => x.ActivityMarketGroupId = newActivityMarketGroup.Id);
			}
		}

		private void DeleteMarketGroups(UpdateActivityDto activityDto)
		{
			var deletedMarketGroupsDtos = activityDto
				.Pharmacy
				.ActivityMarketGroupDtoItems
                .Where(c => c.State == ObjectState.Delete && c.Id > 0);

			var deletedMarketGroupsIds = deletedMarketGroupsDtos
				.Select(x => x.Id)
				.ToList();

			_repository.RemoveAll(_repository
				.Queryable<ActivityMarketGroup>()
				.Where(x => deletedMarketGroupsIds.Contains(x.Id))
				.ToList());

			if (activityDto.Pharmacy.CheckedOrganizations == null) 
				return;

			var removedOrganizations = activityDto
				.Pharmacy
				.CheckedOrganizations
				.Where(c => deletedMarketGroupsIds.Contains(c.ActivityMarketGroupId))
				.ToList();

			
			activityDto.Pharmacy.CheckedOrganizations = activityDto
				.Pharmacy
				.CheckedOrganizations
				.Except(removedOrganizations)
				.ToList();
		}
	}
}