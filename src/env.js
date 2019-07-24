exports.SMTP_HOST = process.env.SMTP_HOST;
exports.SMTP_PORT = process.env.SMTP_PORT;
exports.SMTP_USERNAME = process.env.SMTP_USERNAME;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;
exports.EMAIL = process.env.EMAIL;
exports.TZ = process.env.TZ || "Australia/Melbourne"; // TZ variable is for better logging
exports.NODE_ENV = process.env.NODE_ENV;
exports.BASE_URL = process.env.BASE_URL || "https://www.sustainableofficefurniture.com.au";