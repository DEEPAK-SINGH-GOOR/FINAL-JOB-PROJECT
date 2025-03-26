const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

const sendMail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.email,
      to: to,
      subject: subject,
      html: html,
    };
    transport.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

module.exports = sendMail;
