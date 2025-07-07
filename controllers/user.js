const User = require("../models/user");
const {setUser}=require("../service/auth")

// Post req-> to create user (signup)
async function handleUserSignup(req,res)
{
    const {name,email,password}= req.body;

    // Pending -> validations

    await User.create({
        name,
        email,
        password
    });
    return res.redirect("/");
}

async function handleUserLogin(req,res)
{
    const {email,password}=req.body;
    const user= await User.findOne({email,password});
    if(!user)
    {
        return res.status(404).render("login",{
            error:"Invalid Email or Password",
        });
    }
    const token = setUser(user);
    res.cookie("uid",token);
    
    res.redirect("/");
}

module.exports={
    handleUserSignup,
    handleUserLogin,
}