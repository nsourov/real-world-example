var mongoose = require("mongoose");
var router = require("express").Router();
var passport = require("passport");
var User = mongoose.model("User");
var Role = mongoose.model("Role");
var auth = require("../auth");
var accessControl = require('../accesscontrol');

router.get("/user", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put("/user", auth.required, function(req, res, next) {
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== "undefined") {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.bio !== "undefined") {
        user.bio = req.body.user.bio;
      }
      if (typeof req.body.user.image !== "undefined") {
        user.image = req.body.user.image;
      }
      if (typeof req.body.user.password !== "undefined") {
        user.setPassword(req.body.user.password);
      }

      return user.save().then(function() {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.post("/users/login", function(req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate("local", { session: false }, function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post("/users", function(req, res, next) {
  User.find({}, function(err, users) {
    var user = new User();
    if (!users.length) {
      const role = 'superadmin'
      /**
       * NOTE: Need to make this super admin dynamic by adding this in a environment variable
       */
      user.role = role;
      /**
       * NOTE: For the first user set the user role and permission
       */
      const resources = ["article", "user", "role"];
      const actions = ["create", "delete", "read", "update"];
      const toResource = "any";
      for (let permission of actions) {
        for(let resource of resources){
          const newPermission = new Role({
            role,
            resource,
            action: `${permission}:${toResource}`
          });
          newPermission.save().then(() => console.log('New permission added for superadmin'));
        }
        const userPermission = new Role({
          role: 'user',
          resource: 'article',
          action: `${permission}:own`
        });
        userPermission.save().then(() => console.log('New permission added admin'));
      }
      accessControl().then(permission => console.log('New Permission added',permission));
    }

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user
      .save()
      .then(function() {
        return res.json({ user: user.toAuthJSON() });
      })
      .catch(next);
  });
});

module.exports = router;
