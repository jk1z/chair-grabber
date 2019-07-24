const Chair = require("./models/chair");
const Notifier = require("./helpers/notifier");
const NodeCron = require("node-cron");
const Moment = require("moment-timezone");
const ChairScraper = require("./scrapers/chair");
const Logger = require("./logger");
const _ = require("lodash");

const notificationList = [
    // { email: "", keywords: [`herman miller`,`aeron`,`mirra`], timeoutInterval: "30", timeoutIntervalType: "minutes"},
    // { email: "", keywords: [`herman miller`,`aeron`,`mirra`, `leap`], timeoutInterval: "30", timeoutIntervalType: "minutes"},
];

for (const notificationItem of notificationList){
    Notifier.sendTestEmail(notificationItem.email).then().catch();
}

NodeCron.schedule("* * * * *",async () => {
    try {
        const now = new Moment();
        Logger.info("Started scrapping");
        const results = await ChairScraper.scrape();
        Logger.info(`Finished scrapping. ${results.length} results returned`);
        for (let notificationItem of notificationList) {
            if (!notificationItem.timeoutUntil || notificationItem.timeoutUntil && now.isAfter(notificationItem.timeoutUntil)) {
                const chairs = await Chair.findChairsByNames(notificationItem.keywords, results);
                if (!_.isEmpty(chairs)) {
                    await Notifier.sendEmailSearchAlert(notificationItem.email, chairs);
                    notificationItem.timeoutUntil = now.add(notificationItem.timeoutInterval, notificationItem.timeoutIntervalType);
                    Logger.info("Sent an email to " + notificationItem.email);
                }
            }
        }
    } catch (err) {
        Logger.error(err);
    }
}, {
    timezone: "Australia/Melbourne"
});

