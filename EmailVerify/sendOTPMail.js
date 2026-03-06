  import nodemailer from "nodemailer";
  import 'dotenv/config'
export const sendOTPMail = async(otp, email)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.Mail_USER,
            pass:process.env.Mail_PASS
        }
    })
    const mailConfig = {
        from : process.env.Mail_USER,
        to:email,
        subject:"Password reset OTP",
        html:`<p>Your Password reset OTP is: <b> ${otp} </b> </p> `
    }
    transporter.sendMail(mailConfig, function (error, info){
        if(error) throw  Error(error)
            console.log("OTP send SuccessFull")
        console.log(info)
    })
}