namespace NqPro.EmailAlerts.Models
{
    using System;
    using Interfaces;
    public class ActiveCampaign: IAlertMesenger
    {
        public string Url { get; }
        public string Key { get; }

        public ActiveCampaign(string url, string key)
        {
            if (string.IsNullOrEmpty(url)) throw new ArgumentException("Email must be non-empty.");
            if (string.IsNullOrEmpty(key)) throw new ArgumentException("Password must be non-empty.");
            Url = url;
            Key = key;
        }

        public void SetIdentity(IMesengerIdentity identity)
        {
            //removed working code
        }

        public void SendMessage(string message, string @from, string to)
        {
            //removed working code
        }
    }
}
