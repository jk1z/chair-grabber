const Env = require("../env");
const Emailer = require("./emailer");

exports.decorateProducts = (products) => {
    return products.map(product => {
        return product.decorate();
    });
};

exports.sendEmailSearchAlert = async (to, products) => {
    await Emailer.sendEmail({
        from: Env.EMAIL,
        to,
        subject: "Sustainable Office Furniture Search Alert",
        text: exports.decorateProducts(products).join("\n")
    });
};

exports.sendTestEmail = async (to) => {
    await Emailer.sendEmail({
        from: Env.EMAIL,
        to,
        subject: "Sustainable Office Furniture - Subscribe system",
        text: "System started - This is a test subscription email"
    });
};