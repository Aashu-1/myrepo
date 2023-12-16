import nodemailer from "nodemailer";

function sendOtpMail(email, otp) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aashutoshchouhan2@gmail.com",
      pass: "evrecjwisfghixao",
    },
  });

  var mailOptions = {
    from: "aashutoshchouhan2@gmail.com",
    to: email,
    subject: "Doctorz!",
    html: `<h1>Your otp for registration on doctorz is ${otp}</h1>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export default sendOtpMail;
