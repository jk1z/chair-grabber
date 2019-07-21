exports.decorateProducts = (products) => {
    return products.map(product => {
        return `Product: ${product.name}. Price: ${product.price}. Status: ${product.status}. Link: ${product.link}`
    });
};