const env = {
  "baseApiUrl": "https://firstviewbackend.com/api/v1",
  "baseOneSignalApiUrl": "https://onesignal.com/api/v1",
  "oneSignalAppId": "da4f2d05-3419-4765-ad7e-228db4b6ada2",
  "versionNumber": "1.3.0",
  "buildNumber": "165",
  "app": {
    "etaRefreshInterval": 15,
    "redux": {
      "persistWhitelist": [
        "loginPersistent",
        "walkthroughPersistent"
      ]
    },
    "google": {
      "analyticsTrackerId": "UA-105436795-1"
    }
  }
};
export default env;