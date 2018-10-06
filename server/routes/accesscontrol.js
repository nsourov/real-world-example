const AccessControl = require("accesscontrol");
const mongoose = require('mongoose');
const Role = mongoose.model('Role');

async function accessControl() {
  const grantList = await Role.find({});
  const filteredObj = grantList.map(e => ({
    role: e.role,
    resource: e.resource,
    action: e.action,
    attributes: e.attributes
  }));
  const ac = new AccessControl();
  ac.setGrants(filteredObj);
  return ac;
}
module.exports = accessControl