const ChairScraper = require("./scrapers/chair");
const Notifier = require("./helpers/notifier");

(async () => {
    const chairs = await ChairScraper.findChairsByNames(["medapal"]);
    const text = Notifier.decorateProducts(chairs);
    console.log(text.join("\n"));
})();