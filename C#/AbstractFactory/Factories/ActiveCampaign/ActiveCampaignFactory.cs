using NqPro.EmailAlerts.Models;

namespace NqPro.EmailAlerts.Factories.ActiveCampaign
{
    using EmailAlerts.Interfaces;
    using Interfaces;
    using System;

    public class ActiveCampaignFactory : IEmailAlertFactory
    {
        private readonly string _url;
        private readonly string _key;

        public ActiveCampaignFactory(string url, string key)
        {
            if (String.IsNullOrEmpty(url)) throw new ArgumentNullException(nameof(url));
            if (String.IsNullOrEmpty(key)) throw new ArgumentNullException(nameof(key));
            this._url = url;
            this._key = key;
        }

        public IMesengerIdentity CreateIdentity()
        {
            return new SendGridIdentity();
        }

        public IAlertMesenger GetMessenger()
        {
            return new Models.ActiveCampaign(_url, _key);
        }
    }
}
