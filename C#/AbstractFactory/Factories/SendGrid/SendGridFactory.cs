using NqPro.EmailAlerts.Models;

namespace NqPro.EmailAlerts.Factories.SendGrid
{
    using System;
    using Interfaces;
    using EmailAlerts.Interfaces;
    public class SendGridFactory : IEmailAlertFactory
    {
        private readonly string _key;

        public SendGridFactory(string key)
        {
            if (String.IsNullOrEmpty(key)) throw new ArgumentNullException(nameof(key));
            this._key = key;
        }
        
        public IMesengerIdentity CreateIdentity()
        {
            return new SendGridIdentity();
        }

        public IAlertMesenger GetMessenger()
        {
            return new Models.SendGrid(_key);
        }


    }
}
