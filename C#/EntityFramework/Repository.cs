namespace Hermes.Domain
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Extensions;
    using Interfaces;

    public class Repository : IDisposable, IRepository
    {
        private readonly HermesContext _context;

        public Repository()
        {
            _context = new HermesContext();
        }

        public Repository(HermesContext context)
        {
            _context = context;
        }

        public IQueryable<TEntity> Queryable<TEntity>() where TEntity : class, IIdentityEntity
        {
            return _context.Set<TEntity>();
        }

        public IQueryable<TEntity> QueryableAsNoTracking<TEntity>() where TEntity : class, IIdentityEntity
        {
            return Queryable<TEntity>().AsNoTracking();
        }

        public void Add<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity
        {
            _context.Set<TEntity>().Add(entity);
        }

        public void AddAll<TEntity>(IEnumerable<TEntity> entities) where TEntity : class, IIdentityEntity
        {
            foreach (var entity in entities)
                Add(entity);
        }

        private void Attach<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity
        {
            _context.Entry(entity).State = EntityState.Unchanged;
        }

        public TEntity LocalOrAttach<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity
        {
            var v = _context.ChangeTracker
                .Entries<TEntity>().ToList();

            Debug.WriteLine(v.Count);

            var dbEntityEntry = _context.ChangeTracker
                .Entries<TEntity>()
                .FirstOrDefault((entr => entr.Entity.Id == entity.Id));

            if (dbEntityEntry != null)
                return dbEntityEntry.Entity;

            Attach(entity);

            return entity;
        }

        public void Remove<TEntity>(TEntity entity) where TEntity : class, IIdentityEntity
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public void RemoveAll<TEntity>(IEnumerable<TEntity> entities) where TEntity : class, IIdentityEntity
        {
            _context.Set<TEntity>().RemoveRange(entities);
        }

        public DbContextTransaction BeginTransaction(IsolationLevel isolationLevel = IsolationLevel.RepeatableRead)
        {
            return _context.Database.BeginTransaction(isolationLevel);
        }

        public void UsingTransaction(Action action, IsolationLevel isolationLevel = IsolationLevel.RepeatableRead)
        {
            using (var transaction = BeginTransaction(isolationLevel))
                transaction.Use(action);
        }

	    public void Save()
        {
            _context.SaveChanges();
        }

        public Task<int> SaveAsync()
        {
            return _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool isManagedOnly)
        {
            _context.Dispose();
        }
    }
}