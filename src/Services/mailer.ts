import nodemailer from "nodemailer";
import { Request, Response } from "express";
import * as fs from "fs";
import * as ejs from "ejs";
import * as path from 'path';


export let randomNumber: number = 0

export let randomNumber_ForgotPassword: number = 0

//hàm gửi email
export const sendMail = async function mailler(req: Request, res: Response) {
  const email = req.body.email
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  //hàm random mã otp
  function generateRandomNumber(): number {
    return Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
  }
  const random = generateRandomNumber();

  //trỏ đường dẫn đến file html templatEmail
  const templatePath = path.join(__dirname, '../themeEmail/templateEmail.ejs');
  const htmlMail = fs.readFileSync(templatePath, 'utf-8')
  // Render template HTML với dữ liệu OTP
  const renderedTemplate = ejs.render(htmlMail, { otp: random });

  // Thiết lập thời gian đếm ngược là 30 giây
  const countDownTime = 30 * 1000; // 30 giây tính theo millisecond
  let countdown = setTimeout(() => {
    // Sau 30 giây, đặt lại biến randomNumber thành 0
    randomNumber = 0;
  }, countDownTime);

  //GUI EMAIL
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "demowebtest68@gmail.com", // generated ethereal user
      pass: "bzikhdtdgkpnubok", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "demowebtest68@gmail.com", // sender address
    // to: email, // list of receivers
    to:"cauvangvietnam47@gmail.com",
    subject: "Hello ✔", // Subject line
    text: "Hello", // plain text body
    html: renderedTemplate, // html body
  }, (err) => {
    if (err) {
      return res.json({ mess: "loi:", err });
    }
    return res.json({ mess: "da gui thanh cong" })
  }
  );

  randomNumber = random
}

//hàm gửi email quên mật khẩu
export const sendMail_ForgotPassword = async function mail_forgotPass(req: Request, res: Response) {
  const email = req.body.email
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  //hàm random mã otp
  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000000);
  }
  const random = generateRandomNumber();

  //trỏ đường dẫn đến file html templatEmail
  const templatePath = path.join(__dirname, '../themeEmail/templateEmail.ejs');
  const htmlMail = fs.readFileSync(templatePath, 'utf-8')
  // Render template HTML với dữ liệu OTP
  const renderedTemplate = ejs.render(htmlMail, { otp: random });

  // Thiết lập thời gian đếm ngược là 30 giây
  const countDownTime = 60 * 1000; // 30 giây tính theo millisecond
  let countdown = setTimeout(() => {
    // Sau 30 giây, đặt lại biến randomNumber thành 0
    randomNumber = 0;
  }, countDownTime);

  //GUI EMAIL
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "demowebtest68@gmail.com", // generated ethereal user
      pass: "bzikhdtdgkpnubok", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "demowebtest68@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello", // plain text body
    html: renderedTemplate, // html body
  }, (err) => {
    if (err) {
      return res.json({ mess: "loi:", err });
    }
    return res.json({ mess: "da gui thanh cong" })
  }
  );

  randomNumber_ForgotPassword = random
}

//CONTACT
export const contact = async function Email(req: Request, res: Response) {
  const email = req.body.email
  const subject = req.body.subject
  const text = req.body.text
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  //GUI EMAIL
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "demowebtest68@gmail.com", // generated ethereal user
      pass: "bzikhdtdgkpnubok", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${email} <demowebtest68@gmail.com>`, // sender address
    to: 'hothanhphuc1204@gmail.com', // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    //html: , // html body
  }, (err) => {
    if (err) {
      return res.json({ mess: "loi:", err });
    }
    return res.json({ mess: "da gui thanh cong" })
  }
  );
}

