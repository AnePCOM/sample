namespace NqPro.EmailAlerts.Interfaces
{

    public interface IAlertHolder
    {
    }

    public interface IAlertMesenger : IAlertHolder
    {
        void SendMessage(string message, string from, string to);
        
    }
}
