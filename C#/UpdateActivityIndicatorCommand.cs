using System.Data.Entity;

namespace Hermes.Api.Activities.Commands
{
    using System.Collections.Generic;
    using System.Linq;
    using Activities.Dtos;
    using Domain;
    using Domain.Enums;
    using Domain.Models.Activities;
    using Indicator.Dtos;

    public class UpdateActivityIndicatorCommand
    {
        private readonly IRepository _repository;

        public UpdateActivityIndicatorCommand(IRepository repository)
        {
            _repository = repository;
        }

        public long Execute(UpdateActivityDto activityDto)
        {
            if (activityDto.Conditions == null)
                return activityDto.ActivityId;

            AddNewIndicators(activityDto);
            DeleteIndicators(activityDto);
            DeleteIndicatorsInActivityProduct(activityDto);
            UpdateIndicators(activityDto);
            return activityDto.ActivityId;
        }

        private void AddNewIndicators(UpdateActivityDto activityDto)
        {
            var newActivityIndicatorDtos = activityDto
                .Conditions
                .ActivityIndicatorList
                .Where(c => c.State == ObjectState.Create && c.Indicator.Id != 0)
                .ToList();

            foreach (var newActivityIndicator in newActivityIndicatorDtos)
            {
                if (newActivityIndicator.Indicator == null || newActivityIndicator.ProductType == null) continue;
                if (newActivityIndicator.ProductType.Id == 0 || newActivityIndicator.ProductType.Id == 0) continue;

                var activityIndicator = new ActivityIndicator
                                        {
                                            ActivityId = activityDto.ActivityId,
                                            IndicatorId = newActivityIndicator.Indicator.Id,
                                            ProductTypeId = newActivityIndicator.ProductType.Id,
                                            Comments = newActivityIndicator.Comments
                                        };
                
                
                _repository.Add(activityIndicator);

                _repository.Save();

                if (newActivityIndicator.CheckedActivityIndicator == null) continue;

                List<ActivityIndicatorCheck> activityIndicatorCheckList = newActivityIndicator.CheckedActivityIndicator.Select(indicatorCheck => new ActivityIndicatorCheck
                {
                    ActivityMarketGroupId = indicatorCheck.ActivityMarketGroupId, 
                    ActivityIndicatorId = activityIndicator.Id, 
                    ProductId = indicatorCheck.ProductId, 
                    IndicatorFieldId = indicatorCheck.IndicatorFieldId, 
                    IndicatorFieldValue = string.IsNullOrEmpty(indicatorCheck.IndicatorFieldValue) ? string.Empty : indicatorCheck.IndicatorFieldValue
                }).ToList();
                _repository.AddAll(activityIndicatorCheckList);
                _repository.Save();
            }
        }

        private void DeleteIndicators(UpdateActivityDto activityDto)
        {
            var deletedActivityIndicatorDtos = activityDto
                .Conditions
                .ActivityIndicatorList
                .Where(c => c.State == ObjectState.Delete && c.Id > 0)
                .ToList();

            foreach (var deletedActivityIndicator in deletedActivityIndicatorDtos)
            {
                _repository.RemoveAll(_repository
                    .Queryable<ActivityIndicatorCheck>()
                    .Where(c => c.ActivityIndicatorId == deletedActivityIndicator.Id)
                    .ToList());

                _repository.Remove(_repository
                    .Queryable<ActivityIndicator>()
                    .SingleOrDefault(c => c.Id == deletedActivityIndicator.Id));
            }
            _repository.Save();

        }

        private void DeleteIndicatorsInActivityProduct(UpdateActivityDto activityDto)
        {
            var productList = _repository.Queryable<ActivityProduct>().Where(c => c.ActivityId == activityDto.ActivityId);
            var activityIndicatorList = _repository.Queryable<ActivityIndicatorCheck>()
                .Include(c => c.ActivityIndicator)
                .Where(
                    c =>
                        c.ActivityIndicator.ActivityId == activityDto.ActivityId &&
                        !productList.Any(c2 => c2.ProductId == c.ProductId)).ToList();

            if (activityIndicatorList.Count != 0) _repository.RemoveAll(activityIndicatorList);
            _repository.Save();
        }


        private void UpdateIndicators(UpdateActivityDto activityDto) 
        {
            var activityIndicatorDtos = activityDto
                .Conditions
                .ActivityIndicatorList
                .Where(c => c.State == ObjectState.Edit)
                .ToList();

            foreach (var activityIndicatorDto in activityIndicatorDtos)
            {
                var activityIndicator = _repository
                    .Queryable<ActivityIndicator>()
                    .SingleOrDefault(c => c.Id == activityIndicatorDto.Id);

                if (activityIndicator == null) continue;

                activityIndicator.Comments = activityIndicatorDto.Comments;
                activityIndicator.IndicatorId = activityIndicatorDto.Indicator.Id;
                activityIndicator.ProductTypeId = activityIndicatorDto.ProductType.Id;
                _repository.LocalOrAttach(activityIndicator);
            }

            var indicatorDtos = activityDto
                .Conditions
                .ActivityIndicatorList
                .Where(c => c.State == ObjectState.Edit || c.State == ObjectState.Normal)
                .ToList();

            foreach (var indicator in indicatorDtos)
            {
                _repository.RemoveAll(_repository
                    .Queryable<ActivityIndicatorCheck>()
                    .Where(c => c.ActivityIndicatorId == indicator.Id)
                    .ToList());
                _repository.Save();

                List<ActivityIndicatorCheck> activityIndicatorCheckList = indicator.CheckedActivityIndicator.Select(indicatorCheck => new ActivityIndicatorCheck
                {
                    ActivityMarketGroupId = indicatorCheck.ActivityMarketGroupId,
                    ActivityIndicatorId = indicator.Id,
                    ProductId = indicatorCheck.ProductId,
                    IndicatorFieldId = indicatorCheck.IndicatorFieldId,
                    IndicatorFieldValue = string.IsNullOrEmpty(indicatorCheck.IndicatorFieldValue) ? string.Empty : indicatorCheck.IndicatorFieldValue
                }).ToList();
                _repository.AddAll(activityIndicatorCheckList);
                _repository.Save();
            }
           
        }
    }
}