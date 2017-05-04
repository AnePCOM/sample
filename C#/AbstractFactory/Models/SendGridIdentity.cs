namespace NqPro.EmailAlerts.Models
{
    using NqPro.EmailAlerts.Interfaces;
    class SendGridIdentity: IMesengerIdentity
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
