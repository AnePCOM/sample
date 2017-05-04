namespace NqPro.EmailAlerts.Factories.Interfaces
{
    using EmailAlerts.Interfaces;
    public interface IEmailAlertFactory
    {
        IAlertMesenger GetMessenger();
        IMesengerIdentity CreateIdentity();
    }
}
