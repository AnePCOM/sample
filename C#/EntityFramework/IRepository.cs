namespace Hermes.Domain
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using Interfaces;

    public interface IRepository
    {
        IQueryable<TEntity> Queryable<TEntity>() where TEntity : class, IIdentityEntity;

        IQueryable<TEntity> QueryableAsNoTracking<TEntity>() where TEntity : class, IIdentityEntity;

        void Add<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity;

        void AddAll<TEntity>(IEnumerable<TEntity> entities) where TEntity : class, IIdentityEntity;

        TEntity LocalOrAttach<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity;

        void Remove<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity;

        void RemoveAll<TEntity>(IEnumerable<TEntity> entities) where TEntity : class, IIdentityEntity;

        DbContextTransaction BeginTransaction(IsolationLevel isolationLevel);

        void UsingTransaction(Action action, IsolationLevel isolationLevel = IsolationLevel.RepeatableRead);

        void Save();

        Task<int> SaveAsync();
    }
}