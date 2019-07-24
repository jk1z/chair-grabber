const Request = require("request-promise-native");
const Cheerio = require("cheerio");
const Env = require("../env");
const Chair = require("../models/chair");
const Logger = require("../logger");

exports.scrape = async function (){
    const uri = Env.BASE_URL + "/our-range/category/chairs";
    let options = {
        uri,
        transform: function (body) {
            return Cheerio.load(body);
        }
    };
    const $ = await Request.get(options);
    const title = $(".categoryLevel1").text();
    Logger.debug(`Things we are grabbing. Title: ${title}`);
    const categoryGroups = $(".categoryGroup");
    Logger.debug(`Number of category to scrape: ${categoryGroups.length}`);
    const chairs = [];
    for (let i = 0; i < categoryGroups.length; i++){
        Logger.debug(`Going through categoryGroup: ${i + 1}`);
        const categoryGroup = $(categoryGroups.get(i));
        const subCategory = categoryGroup.children('.categoryGroupHead').text();
        Logger.debug(`Sub category: ${subCategory}`);
        categoryGroup.find('.productBox').each(
            (i, productBox) => {
                const chair = Chair.buildFromCherryObject($(productBox));
                chair.refCategory = subCategory;
                chairs.push(chair)
            }
        );
    }
    return chairs;
};