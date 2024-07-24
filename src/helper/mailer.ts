import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs"

export const sendEmail=async({email,emailType,userId}:any)=>{
   try {
    
    const hashedToken=await bcryptjs.hash(userId.toString(),10);

   if(emailType ==="VERIFY"){
    await User.findByIdAndUpdate(userId,{
        verifyToken:hashedToken,
        verifyTokenExpiry:Date.now()+3600000
    })
   }
   else if(emailType ==="RESET"){
    await User.findByIdAndUpdate(userId,{
        forgotPasswordToken:hashedToken,
        forgotPasswordTokenExpiry:Date.now()+3600000
    })
   }

   var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7e1e7faaade422",  //in env file
      pass: "9e5fef3f546463"   //in env file
    }
  });
 
const mailOption={
    from:'aman@aman.ai',
    to: email,
    subject:emailType==='VERIFY'?"Verify your email" : "Reset your password",
    html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"?"Verify your email":"reset your email"}< or copy and paste the link below in your browser,
    <br>
    ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    /p>`,
  }

  const mailResponse = await transporter.sendMail(mailOption)
  return mailResponse;

   } catch (error:any) {
    throw new Error(error.message)
   }
}