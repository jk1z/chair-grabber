const _ = require("lodash");
const Product = require("./product");
const Env = require("../env");
const ChairScraper = require("../scrapers/chair");
class Chair extends Product.Product {
    constructor(name, price, status, link){
        super(name, price, status, link);
    }

    isMatched(name){
        return this._name.toLowerCase().includes(name.toLowerCase()) || this._name.toLowerCase().match(name);
    }
}

exports.buildFromCherryObject = (cherryDOM) => {
    const price = cherryDOM.find('.priceOverlay').text();
    const name = cherryDOM.find('h2 a').text();
    const productStatus = cherryDOM.find('.productBoxImg .overlay img');
    let status = Product.STATUS_AVAILABLE;
    if (productStatus && productStatus.attr("alt") === "sold") status = Product.STATUS_SOLD_OUT;
    const link = `${Env.BASE_URL}${cherryDOM.find('.productBoxImg a').first().attr("href")}`;
    return new Chair(name, price, status, link);
};

exports.findChairsByNames = async  (names, results = []) => {
    const chairs = _.isEmpty(results) ? await ChairScraper.scrape() : results;
    const products = chairs.filter(product => _.some(names, name => product.isMatched(name)));
    return products
};
