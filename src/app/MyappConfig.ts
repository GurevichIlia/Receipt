

let appConfig = {
  version: "1.0.0.0",
  minSvcVersion: "",
  minDbsVersion: "",
  falbackLanguage: "he"
};

let serviceConfig = {
  serviceBaseUrl: "https://jaffawebapi.amax.co.il/Api.svc/",
  ImageUrl: "http://jaffapms.amax.co.il/orgs/",
  serviceApiUrl: "https://jaffawebapi.amax.co.il/API/",
  serviceUrl: "",
  AppUrl: "https://jaffawebapi.amax.co.il/",
  accesTokenStoreName: "XToken",
  accesTokenRequestHeader: "X-Token",
  accesTokenResponceHeader: "XToken",
  authenticationMode: "JWT-Token",
   currentBaseURL: 'https://jaffawebapisandbox.amax.co.il/API/'
};

export var LocalDict = {
  selectedLanguage: "preferedLanguage",
  languageResource: "languageResource",
  SmsSettings: "smsSettings"
};

export var SessionlDict = {};
if (window.location.href.indexOf("localhost") > -1)
  serviceConfig.serviceApiUrl = "http://localhost:2093/Api/";
export { serviceConfig, appConfig };

export class MyAppConfig {
  static serviceConfig = {
    serviceBaseUrl: "https://jaffawebapi.amax.co.il/Api.svc/",
    ImageUrl: "http://jaffapms.amax.co.il/orgs/",
    serviceApiUrl: 'https://jaffawebapisandbox.amax.co.il/API/',
    serviceUrl: "",
    AppUrl: "https://jaffawebapi.amax.co.il/",
    accesTokenStoreName: "XToken",
    accesTokenRequestHeader: "X-Token",
    accesTokenResponceHeader: "XToken",
    authenticationMode: "JWT-Token"
  };
}