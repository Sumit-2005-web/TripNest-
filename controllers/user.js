const User = require('../models/user.js');

module.exports.renderSignUpForm =  (req , res) => {
    res.render("user/signup.ejs");
 }

module.exports.signUp = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("/listings");
        });
    } catch(err) {
       req.flash("error", err.message);
       res.redirect("/signup");
    }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome Back To TripNest! You are Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.userLogout =  (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User log out successfully");
      res.redirect("/listings");
    });
  }