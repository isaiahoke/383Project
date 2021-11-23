require('dotenv').config();
const exec = require('exec-then');
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const fetch = require('node-fetch');
const { createErrorNotification } = require('../helpers');

exports.view_home = async (req, res)=>{
    const user = req.user
    console.log(req.user)
    res.render('user/home', {user: user})
}

exports.render_signin = async(req, res)=>{
    res.render('user/signin')
}


exports.render_signup = async(req, res)=>{
    res.render('user/signup')
}


exports.signup = async(req, res)=>{
    const fullnames = req.body.fullnames; 
    const email = req.body.username.toLowerCase(); 
    const password = req.body.password;
    const city = req.body.city
   
    User.findOne({username: email, type:'USER'}).exec(function(err, user){
        if(err){
            createErrorNotification(req, res, 'An error occured please try again later')
        } else if(user){
            createErrorNotification(req, res, 'Email already in use')
        }else{
            validateLocation(req, res, city, ()=>{
                User.register({username: email, type:'USER', fullnames: fullnames, location:city}, password, (err, user)=>{
                    if(err){
                        createErrorNotification(req, res, 'An error occured please try again later')
                    }else{
                        passport.authenticate('local',{session:true})(req, res, function(){
                            res.redirect('/');
                        })
                    }
                })
            })
        }
    }) 
         

}

exports.login_user = function(req, res) {
	const user_name = req.body.username 
	User.findOne({ username: user_name, type:'USER' },(err, founduser)=> {
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
								res.redirect('/' );
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

 //Logout or signout User

exports.logout_user = function(req, res) {
	exec(req.logout()).then( res.redirect('/signin'))  
}


exports.changeLocation = async(req, res)=>{
    const userId = req.user._id
    const city = req.body.city
   
    
    changeLocation(req, res, city, ()=>{
        User.findOneAndUpdate({_id: userId}, {location: city}, (err, user)=>{
            if(err){
                createErrorNotification(req, res, 'An error occured please try again later')
            }else{
                res.redirect('/');
            }
        })
    })
       

}

async function validateLocation(req, res, city, doNext){
    const url = process.env.APIURL+'?q='+city+'&appid='+process.env.WEATHERAPIKEY
     try{
      const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(city),
            headers: {'Content-Type': 'application/json'}
        });
        if(response.status == 200){
            data = await response.json()
            doNext()
        }else{
            createErrorNotification(req, res, 'No city found matching your selection')
        }
     } catch (error){
        createErrorNotification(req, res, 'An error occured')
     }
}

async function changeLocation(req, res, city, doNext){
   
    const url = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&units=metric&cnt=7&lang=en&appid=c0c4a4b4047b97ebc5948ac9c48c0559'
    try{
        const response = await fetch(url, {
              method: 'post',
              body: JSON.stringify(city),
              headers: {'Content-Type': 'application/json'}
          });
          if(response.status == 200){
              data = await response.json()
              doNext()
          }else{
              console.log('404 oo')
              createErrorNotification(req, res, 'No city found matching your selection')
          }
       } catch (error){
          createErrorNotification(req, res, 'An error occured')
       }
    

}

