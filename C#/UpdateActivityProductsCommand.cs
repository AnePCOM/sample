namespace Hermes.Api.Activities.Commands
{
    using System.Linq;
    using Activities.Dtos;
    using Domain;
    using Domain.Models.Activities;
    using Domain.Models.Products;
    using Shared.Extensions;

    public class UpdateActivityProductsCommand
    {
        private readonly IRepository _repository;

        public UpdateActivityProductsCommand(IRepository repository)
        {
            _repository = repository;
        }

        public long Execute(UpdateActivityDto activityDto)
        {
            if (activityDto.Products == null)
                return activityDto.ActivityId;

            var activity = _repository
                .Queryable<Activity>()
                .Single(x => x.Id == activityDto.ActivityId);

            activity.PackageName = activityDto.Products.PackageName;

            if (activityDto.Products.RemovedProductsIds.IsEmpty() == false)
            {
                var removedActivityProducts = _repository
                    .Queryable<ActivityProduct>()
                    .Where(x => x.Activity.Id == activityDto.ActivityId && activityDto.Products.RemovedProductsIds.Contains(x.Product.Id))
                    .ToList();

                _repository.RemoveAll(removedActivityProducts);
            }

            if (activityDto.Products.AddedProductsIds.IsEmpty() == false)
            {
                var activityProducts = _repository
                    .QueryableAsNoTracking<ActivityProduct>()
                    .Where(x => x.Activity.Id == activityDto.ActivityId)
                    .Select(x => x.Product.Id)
                    .ToList();

                var addedProductsIds = _repository
                    .QueryableAsNoTracking<Product>()
                    .Where(x => activityDto.Products.AddedProductsIds.Contains(x.Id))
                    .Where(x => activityProducts.Contains(x.Id) == false)
                    .Select(x => x.Id)
                    .ToList();

                foreach (var addedProductId in addedProductsIds)
                {
                    _repository.Add(new ActivityProduct
                                    {
                                        ActivityId = activityDto.ActivityId,
                                        ProductId = addedProductId
                                    });
                }
            }

            _repository.Save();

            return activity.Id;
        }
    }
}