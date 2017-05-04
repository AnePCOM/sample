namespace NQPro.Infrastructure.Common
{
    using System.Data.SqlClient;

    /// <summary>
    /// ADO.NET class for tracking the current state
    /// </summary>
    public class AdoSingletonConnection
    {
        //TODO please use this class only for service events. for the other we have a  repository
        private static string connectionString = @"remove";
        private static AdoSingletonConnection singletonObj;
        private static SqlConnection sqlConnection;

        public SqlConnection SqlConnetionFactory => sqlConnection;

        private AdoSingletonConnection() { }

        public static AdoSingletonConnection Singleton
        {
            get
            {
                if (singletonObj == null)
                    singletonObj = new AdoSingletonConnection();

                sqlConnection = new SqlConnection(connectionString);
                return singletonObj;
            }
        }

    }

}
