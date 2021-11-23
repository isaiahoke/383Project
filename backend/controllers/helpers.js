// send error notification or flash

function createErrorNotification(req, res, message){
    req.flash('error', message)
    res.redirect('back')
}


function hasPermissions(req, res, next){
    console.log(req.isAuthenticated())
    if(req.isAuthenticated() && req.user.type == 'USER'){
        console.log(req)
        next()
    }else{
        req.flash("error", "Your session has expired, please log in");
        res.redirect('/signin')
    }

}

function adminPermissions_1(req, res, next){
    if(req.isAuthenticated() && req.user.type =='ADMIN'){
        next()
    }else{
        req.flash("error", "Your session has expired, please log in");
        res.redirect('/admin-signin')
    }
}

function toLow(req, res, next){
    const username = req.body.username.toLowerCase()
    req.body.username = username
    next()
}

module.exports = {
    createErrorNotification, hasPermissions, adminPermissions_1, toLow
}