require('dotenv').config();
const exec = require('exec-then');
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

const { createErrorNotification } = require('../helpers');

exports.view_dashboard = async (req, res)=>{
    const user = req.user
    User.find({type: 'USER'}).exec((err, users)=>{
        if(err){
            createErrorNotification(req, res, 'An error occured please try again later')
        }else{
            res.render('admin/home', {user: user, userlist: users})
        }
    })
    
}

exports.render_admin_signin = async(req, res)=>{
    res.render('admin/signin')
}


exports.render_admin_signup = async(req, res)=>{
    res.render('admin/signup')
}


exports.admin_signup = async(req, res)=>{
    const email = req.body.username.toLowerCase(); 
    const password = req.body.password;
   
   
    User.findOne({username: email}).exec(function(err, user){
        if(err){
            createErrorNotification(req, res, 'An error occured please try again later')
        } else if(user){
            createErrorNotification(req, res, 'Email already in use')
        }else{
           
            User.register({username: email, type:'ADMIN'}, password, (err, user)=>{
                if(err){
                    createErrorNotification(req, res, 'An error occured please try again later')
                }else{
                    passport.authenticate('local',{session:true})(req, res, function(){
                        res.redirect('/admin-dashboard');
                    })
                }
            })
          
        }
    }) 
         

}

exports.login_admin = function(req, res) {
	const user_name = req.body.username 
	User.findOne({ username: user_name, type:'ADMIN' },(err, founduser)=> {
		 if (founduser) {
			 const user = new User({
				 username: user_name,
				 password: req.body.password
			 });
			 passport.authenticate('local', function(err, user) {
				 if (err) {
					createErrorNotification(req, res, 'An error occured please try again later')
				 } else {
					 if (user) {
						 req.login(user, function(err) {
							 if(err){
								createErrorNotification(req, res, 'An error occured please try again later')
							 }else{
								req.flash("success", "Logged in successfully");
								res.redirect('/admin-dashboard' );
							 }
						 })
					 } else {
						createErrorNotification(req, res, 'Email or password is incorrect')
					 }
				 }
			 })(req, res);
		} else if(err) {
				createErrorNotification(req, res, 'An error occured please try again later')
        } else{
				createErrorNotification(req, res, 'User does not exist')
		}
	 });
 
 }

 
exports.logout_admin = function(req, res) {
	exec(req.logout()).then( res.redirect('/admin-signin'))  
}