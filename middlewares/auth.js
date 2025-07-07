const {getUser}= require("../service/auth")
async function restrictToLoggedinUserOnly(req, res, next)
{
    // uid token stored in cookies 
    const userUid= req.cookies?.uid;

    // using headers for the token
    // const userUid=req.headers["authorization"];
    if(!userUid){
        res.redirect("./login");
    }
    const user=getUser(userUid);

    // extracting token by removing bearer and validating that token by secret code
    // const token=userUid.split("Bearer ")[1];
    // const user=getUser(token);

    if(!user)
    {
        res.redirect("./login");
    }

    req.user=user;
    next();
}

async function checkAuth(req, res, next)
{
    // const userUid= req.cookies?.uid;
    const userUid=req.headers["authorization"];

    // const user=getUser(userUid);
    const token=userUid?.split("Bearer ")[1];
    const user=getUser(token);

    req.user=user;
    next();
}

module.exports={
    restrictToLoggedinUserOnly,
    checkAuth,
}
