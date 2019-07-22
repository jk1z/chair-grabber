const Chair = require("./models/chair");
const Notifier = require("./helpers/notifier");
const NodeCron = require("node-cron");
const Moment = require("moment-timezone");
const ChairScraper = require("./scrapers/chair");
const _ = require("lodash");

const notificationList = [];

NodeCron.schedule("* * * * *",async () => {
        const now = new Moment();
        const results = await ChairScraper.scrape();
        for (let notificationItem of notificationList){
            if (!notificationItem.timeoutUntil || notificationItem.timeoutUntil && now.isAfter(notificationItem.timeoutUntil)) {
                const chairs = await Chair.findChairsByNames(notificationItem.keywords, results);
                if (!_.isEmpty(chairs)) {
                    await Notifier.sendEmailSearchAlert(notificationItem.email, chairs);
                    notificationItem.timeoutUntil = now.add(notificationItem.timeoutInterval, notificationItem.timeoutIntervalType);
                    console.log("sent email to " + notificationItem.email);
                }
            } else {
                console.log("Skip");
            }
        }
}, {
    timezone: "Australia/Melbourne"
});

