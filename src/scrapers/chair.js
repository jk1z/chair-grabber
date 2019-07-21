const Request = require("request-promise-native");
const Cheerio = require("cheerio");
const Env = require("../env");
const _ = require("lodash");

exports.STATUS_AVAILABLE = "available";
exports.STATUS_SOLD_OUT = "sold-out";

exports.findChairsByNames = async (names) => {
    let products = [];
    try {
        const results = await exports.scrape();
        for (const result of results){
            products = [...products, ...result.products.filter(product => _.some(names, name => product.name.toLowerCase().includes(name.toLowerCase())))];
        }
        return products
    } catch (err){
        console.warn("Scrape failed ", err);
        return products;
    }
};

exports.scrape = async () => {
    const uri = Env.BASE_URL + "/our-range/category/chairs";
    let options = {
        uri,
        transform: function (body) {
            return Cheerio.load(body);
        }
    };
    const $ = await Request.get(options);
    const title = $(".categoryLevel1").text();
    // console.log("Things we are grabbing. Title: ", title);
    const categoryGroups = $(".categoryGroup");
    // console.log("Number of category to scrape: ", categoryGroups.length);
    const results = [];
    for (let i = 0; i < categoryGroups.length; i++){
        // console.log("Going through categoryGroup: ", i + 1);
        const categoryGroup = $(categoryGroups.get(i));
        const subCategory = categoryGroup.children('.categoryGroupHead').text();
        // console.log("Sub category: ", subCategory);
        const result = {subCategory, products: []};
        categoryGroup.find('.productBox').each((i, productBox) => result.products.push(productBoxExtractor($(productBox))));
        results.push(result);
    }
    return results;
};

const productBoxExtractor = (productBox) => {
    const price = productBox.find('.priceOverlay').text();
    const name = productBox.find('h2 a').text();
    const productStatus = productBox.find('.productBoxImg .overlay img');
    let status = exports.STATUS_AVAILABLE;
    if (productStatus && productStatus.attr("alt") === "sold") status = exports.STATUS_SOLD_OUT;
    const link = `${Env.BASE_URL}${productBox.find('.productBoxImg a').first().attr("href")}`;
    return {price, name, status, link};
};