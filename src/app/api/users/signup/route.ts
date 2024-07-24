import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel"
import { NextResponse,NextRequest } from "next/server";
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helper/mailer";
connect()

export async function POST(request: NextRequest){
try {
    const reqBody=await request.json();
    const {username,email,password} = reqBody;

    //validation
    console.log(reqBody);

    const user= await User.findOne({email})
    if(user){
        return NextResponse.json({error:"user already exists"},{status: 400});
    }
  
    const salt = await bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

   const newUser=new User({
        username,
        email,
        password:hashedPassword
    })

    const savedUser=await newUser.save();
    console.log(savedUser);
    
    //send varification 
    await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})

    return NextResponse.json({
        message:"User registered successfully",
        success:true,
        savedUser
    })
    
} catch (error) {
    
}
}