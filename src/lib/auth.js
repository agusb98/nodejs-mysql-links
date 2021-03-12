module.exports = {

    isLoggedIn(request, response, next) {
        if(request.isAuthenticated()) {
            return next();
        }
        request.flash('message', 'You need to be logged in');
        return response.redirect('/signin');
    },
    
    isNotLoggedIn(request, response, next){
        if(!request.isAuthenticated()) {
            return next();
        }
        request.flash('message', 'You have already logged in');
        return response.redirect('/profile');
    }
}