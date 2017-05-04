namespace NqPro.EmailAlerts.Models
{
    using System;
    using Interfaces;
    public class SendGrid : IAlertMesenger
    {
        public  string ApiKey { get; }

        
        public SendGrid(string apiKey)
        {
            if (string.IsNullOrEmpty(apiKey)) throw new ArgumentException("apiKey must be non-empty.");
            ApiKey = apiKey;
        }

        public void SetIdentity(IMesengerIdentity identity)
        {
            //removed working code
        }

        public void SendMessage(string message, string @from, string to)
        {
            //removed working code
            //  var client = new SendGridClient(_apiKey);


            /* string data = @"{
                       'to': [
                         'to@emailReplace.com',
                       ],
                       'sub': {
                           ':link': [
                             'linkReplace',
                             'linkReplace'
                           ]
                       },
                       'filters': {
                         'templates': {
                            'settings': {
                              'enable': 1,
                              'template_id': '################################3'
                              }
                           }
                        }
                     }";

             data = data.Replace("to@emailReplace.com", toEmail);
             data = data.Replace("linkReplace", link);
             var json = JsonConvert.DeserializeObject<Object>(data);
             var response = await client.RequestAsync(  SendGridClient.Method.POST,
                                                  json.ToString(),
                                                  urlPath: "mail/send");*/
        }
    }
}
