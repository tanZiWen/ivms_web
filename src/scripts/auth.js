
var ensureUserBrief = function(ctx, next) {
  var userModule = document.querySelector('user-module');
  var dispatch = function() {
    if (authorized(userModule.user)) {
      page('/u');
    } else {
      next();
    }
  }
  if (userModule.synced) {
    dispatch();
  } else {
    app.splash('user.syncing');
    userModule.getMyBrief(function(response) {
      if (userModule.synced) {
        dispatch();
      } else {
        app.splash('api.error');
      }
    });
  }
};

var auth = function(ctx, next) {
  var userModule = document.querySelector('user-module');
  var postLoginHanlder = function() {
    page.redirect(ctx.canonicalPath);
  };
  if (authorized(userModule.user)) {
      next();
  } else {
    if (userModule.synced) {
      userModule.showLogin(postLoginHanlder);
    } else {
      app.splash('user.syncing');
      userModule.getMyBrief(function(response) {
        if (userModule.synced) {
          if (authorized(userModule.user)) {
            next();
          } else {
            userModule.showLogin(postLoginHanlder);
          }
        } else {
          app.splash('api.error');
        }
      });
    }
  }
};

function authorized(user) {
  return user != null && user.username != null;
}
