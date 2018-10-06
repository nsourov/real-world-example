import React from "react";

class RoleTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { roles } = this.props;
    const unique = roles && [...new Set(roles.map(item => item.role))];
    const roleTable =
    roles &&
    roles.map((role, i) => (
        <tr ref={role._id} key={role._id}>
          <td>{role.role}</td>
          <td>{role.resource}</td>
          <td>{role.action}</td>
        </tr>
      ));
    return (
      <div>
        <table id="users">
          <tbody>
            <tr>
              <th>Role</th>
              <th>Resource</th>
              <th>Action</th>
            </tr>
            {roleTable}
          </tbody>
        </table>
      </div>
    );
  }
}

export default RoleTable;
