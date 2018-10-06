import React from "react";

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.changeRole = this.changeRole.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  changeRole(e) {
    const userId = e.target.attributes[0].nodeValue;
    const role = e.target.value;
    this.props.changeRole(userId, role);
  }
  deleteUser(e) {
    const userId = e.target.attributes[1].nodeValue;
    this.props.deleteUser(userId);
  }
  render() {
    const { roles, users } = this.props;
    const unique = roles && [...new Set(roles.map(item => item.role))];
    const option =
      unique &&
      unique.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ));
    const userTable =
      users &&
      users.map((user, i) => (
        <tr ref={user.id} key={user.id}>
          <td>{i + 1}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{user.id}</td>
          <td>{user.role}</td>
          <td>
            <select
              onChange={this.changeRole}
              date-id={user.id}
              defaultValue=""
            >
              <option value="" disabled={true}>
                change role
              </option>
              {option}
            </select>{" "}
            <button
              className="btn btn-danger btn-sm"
              date-id={user.id}
              onClick={this.deleteUser}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    return (
      <div>
        <table id="users">
          <tbody>
            <tr>
              <th>Count</th>
              <th>Username</th>
              <th>Email</th>
              <th>Id</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
            {userTable}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserTable;
