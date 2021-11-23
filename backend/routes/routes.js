const { toLow, hasPermissions, adminPermissions_1 } = require('../controllers/helpers')
const user = require('../models/user')

module.exports = function(app) {
    const userpages = require('../controllers/users/user')
    const adminpages = require('../controllers/admin/admin')

    //Sign up
    app.route('/signup')
    .get(userpages.render_signup)
    .post(toLow, userpages.signup)
    //Sign in
    app.route('/signin')
    .get(userpages.render_signin)
    .post(toLow, userpages.login_user)
    // dISPLAY hOMEPAGE
    app.route('/')
    .get(hasPermissions, userpages.view_home)
    //Change user location
    app.route('/changelocation')
    .post(hasPermissions, userpages.changeLocation)

    app.route('/logout-user')
    .get(userpages.logout_user)

    //ADMIN ROUTES
    app.route('/admin-signup')
    .get(adminpages.render_admin_signup)
    .post(toLow, adminpages.admin_signup)

    //Sign in
    app.route('/admin-signin')
    .get(adminpages.render_admin_signin)
    .post(toLow, adminpages.login_admin)

    app.route('/admin-dashboard')
    .get(adminPermissions_1, adminpages.view_dashboard)

    app.route('/logout-admin')
    .get(adminpages.logout_admin)
    

}