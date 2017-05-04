namespace NqPro.EmailAlerts.Models
{
    using NqPro.EmailAlerts.Interfaces;
    class ActiveCampaignIdentity : IMesengerIdentity
    {
        public string Url { get; set; }

        public string Key { get; set; }
    }
}
