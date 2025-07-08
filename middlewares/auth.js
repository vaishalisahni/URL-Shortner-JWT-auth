const {getUser}= require("../service/auth")

// async function restrictToLoggedinUserOnly(req, res, next)
// {
//     // uid token stored in cookies 
//     const userUid= req.cookies?.uid;

//     // using headers for the token
//     // const userUid=req.headers["authorization"];
//     if(!userUid){
//         res.redirect("./login");
//     }
//     const user=getUser(userUid);

//     // extracting token by removing bearer and validating that token by secret code
//     // const token=userUid.split("Bearer ")[1];
//     // const user=getUser(token);

//     if(!user)
//     {
//         res.redirect("./login");
//     }

//     req.user=user;
//     next();
// }

// async function checkAuth(req, res, next)
// {
//     // const userUid= req.cookies?.uid;
//     const userUid=req.headers["authorization"];

//     // const user=getUser(userUid);
//     const token=userUid?.split("Bearer ")[1];
//     const user=getUser(token);

//     req.user=user;
//     next();
// }

// module.exports={
//     restrictToLoggedinUserOnly,
//     checkAuth,
// }

// Clean code for above 2 functions
function checkForAuthentication(req,res,next)
{
    const tokenCookie=req.cookies?.token;
    req.user=null;
    if(!tokenCookie ){
        return next();
    }
    const token=tokenCookie;
    const user=getUser(token);

    req.user=user;
    return next();
}

// Authorization
function restrictTo(roles)
{
    return function(req,res,next)
    {
        if(!req.user) return res.redirect("/login");
        if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    }
}


module.exports={
    checkForAuthentication,
    restrictTo
};