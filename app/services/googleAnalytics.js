import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge';
import env from '../core/env';

let tracker;

export default function configureAnalytics(analyticsTrackerId = env.app.google.analyticsTrackerId) {
  tracker = new GoogleAnalyticsTracker(analyticsTrackerId);
}

export const trackScreenView = screenName => {
  if (tracker) {
    tracker.trackScreenView(screenName);
  }
}


