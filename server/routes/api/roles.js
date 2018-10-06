var router = require("express").Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Role = mongoose.model("Role");
var auth = require("../auth");
var accessControl = require("../accesscontrol");

router.get("/users", auth.required, async (req, res) => {
  try {
    const { role } = req.payload;
    const ac = await accessControl();
    const permission = ac.can(role).readAny("user");
    if (permission.granted) {
      const users = await User.find({});
      const userData = users.map(user => ({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        created: user.createdAt
      }));
      return res.json({ users: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

router.get("/user/:userId", auth.required, async (req, res) => {
  try {
    const { role } = req.payload;
    const ac = await accessControl();
    const permission = ac.can(role).readAny("user");
    if (permission.granted) {
      const user = await User.findById(req.params.userId);
      return res.json({ user });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

router.delete("/users/:userId", auth.required, async (req, res) => {
  try {
    const { role } = req.payload;
    const ac = await accessControl();
    const permission = ac.can(role).deleteAny("user");
    if (permission.granted) {
      const user = await User.findById(req.params.userId);
      await user.remove();
      return res.sendStatus(204);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

router.post("/role", auth.required, async (req, res) => {
  try {
    const { role } = req.payload;
    const ac = await accessControl();
    const permission = ac.can(role).createAny("role");
    if (permission.granted) {
      const toResource = "any";
      const { role, resources, actions } = req.body.permissions;
      for (let permission of actions) {
        for (let resource of resources) {
          const newPermission = new Role({
            role,
            resource,
            action: `${permission}:${toResource}`
          });
          await newPermission.save();
        }
      }
      await accessControl();
      const roles = await Role.find({});
      return res.json({ roles });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

router.put("/users/role/:userId", auth.required, async (req, res) => {
  try {
    const ac = await accessControl();
    const { role } = req.payload;
    const permission = ac.can(role).updateAny("user");
    if (permission.granted) {
      const { role } = req.body;
      const { userId } = req.params;
      if (role && userId) {
        await User.findByIdAndUpdate(userId, { role: role });
        return res.json({ success: true });
      } else {
        return res.status(403).json({
          error: "Please provide the role and user id"
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.delete("/role/:role", auth.required, async (req, res) => {
  try {
    const ac = await accessControl();
    const permission = ac.can(req.payload.role).deleteAny("role");
    if (permission.granted) {
      const { role } = req.params;
      await Role.remove({ role });
      const roles = await Role.find({});
      return res.json(roles);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/role", auth.required, async (req, res) => {
  try {
    const ac = await accessControl();
    const permission = ac.can(req.payload.role).readAny("role");
    if (permission.granted) {
      const roles = await Role.find({}, "role resource action").sort({
        role: 1
      });
      return res.json({ roles });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
