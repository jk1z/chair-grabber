class Product {
    constructor(name, price, status, link, refCategory = "") {
        this._name = name;
        this._price = price;
        this._status = status;
        this._link = link;
        this._refCategory = refCategory;
    }

    get name(){
        return this._name;
    }

    get price(){
        return this._price;
    }

    get status(){
        return this._status;
    }

    get link(){
        return this._link;
    }

    get refCategory(){
        return this._refCategory;
    }

    set refCategory(refCategory){
        this._refCategory = refCategory;
    }

    decorate(){
        return `Product: ${this._name}. Price: ${this._price}. Status: ${this._status}. Link: ${this._link}. Ref category: ${this._refCategory}`;
    }
}

exports.Product = Product;

exports.STATUS_AVAILABLE = "available";
exports.STATUS_SOLD_OUT = "sold-out";
