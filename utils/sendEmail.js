const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS, 
  }
});

const sendConfirmationEmail = (email, verificationToken) => {
  const url = `${process.env.BASE_URL}/api/auth/confirm-email/${verificationToken}`; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please Confirm Your Email Address',
    html: `
      <p>Thank you for signing up! Please click the link below to verify your email address:</p>
      <a href="${url}">Verify Email</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Code',
    html: `
      <p>You requested a password reset. Please use the following code to reset your password:</p>
      <h3>${resetCode}</h3>
      <p>The code will expire in 10 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendEmail,
};
