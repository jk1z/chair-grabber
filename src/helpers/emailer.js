const Env = require("../env");
const NodeMailer = require("nodemailer");

exports.sendEmail = async ({from, to, subject, text, html}) => {
    const transporter = NodeMailer.createTransport({
        host: Env.SMTP_HOST,
        port: Env.SMTP_PORT,
        secure: true,
        auth: {
            user: Env.SMTP_USERNAME,
            pass: Env.SMTP_PASSWORD
        }
    });
    await transporter.sendMail({from, to, subject, text, html});
};