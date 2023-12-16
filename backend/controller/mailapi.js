import nodemailer from "nodemailer";

function sendMail(email, password, otp) {
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
    subject: "College",
    html: `<h1>Congratulations! You have successfully registered on College website,</h1>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export default sendMail;
