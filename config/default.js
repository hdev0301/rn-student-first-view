module.exports = {
    oneSignal: {
        baseUrl: 'https://onesignal.com/api/v1'
    },
    app: {
        etaRefreshInterval: 15,
        redux: {
            persistWhitelist: ['loginPersistent', 'walkthroughPersistent']
        }
    },
    version: {
        code: '165',
        name: '1.3.0'
    }
};
