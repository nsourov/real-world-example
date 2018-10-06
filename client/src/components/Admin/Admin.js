import React from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import UserTable from "./User_Table";
import RoleTable from "./Role_Table";

import {
  GET_ALL_USER,
  GET_ROLE,
  SET_ROLE,
  DELETE_USER,
  GET_USER,
  DELETE_ROLE,
  SET_PERMISSION
} from "../../constants/actionTypes";
import agent from "../../agent";

import "./admin.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      targetRole: "",
      role: "",
      res_post: false,
      res_user: false,
      res_role: false,
      action_create: false,
      action_delete: false,
      action_read: false,
      action_update: false,
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.addRole = this.addRole.bind(this);
  }
  componentWillMount() {
    const { user } = this.props;
    if (user) {
      if (user.role !== "user") {
        this.props.getAllUser();
        this.props.getRoles();
      } else {
        window.location = "/";
      }
    } else {
      window.location = "/";
    }
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  searchUser(e) {
    e.preventDefault();
    this.props.searchUser(this.state.search);
  }
  deleteRole(e) {
    e.preventDefault();
    this.props.deleteRole(this.state.targetRole);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeCheckBox(e) {
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }
  addRole(e) {
    e.preventDefault();
    const {
      role,
      res_post,
      res_role,
      res_user,
      action_create,
      action_delete,
      action_read,
      action_update
    } = this.state;

    let resources = [];
    let actions = [];
    if (res_post) {
      resources.push("post");
    }
    if (res_user) {
      resources.push("user");
    }
    if (res_role) {
      resources.push("role");
    }
    if (action_create) {
      actions.push("create");
    }
    if (action_delete) {
      actions.push("delete");
    }
    if (action_read) {
      actions.push("read");
    }
    if (action_update) {
      actions.push("update");
    }
    this.props.addRole({ role, resources, actions });
    this.setState({ modalIsOpen: false });
  }
  render() {
    const { roles } = this.props;
    const unique = roles && [...new Set(roles.map(item => item.role))];
    const option =
      unique &&
      unique.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ));
    return (
      <div className="container">
        <button className="btn-md btn btn-info" onClick={this.openModal}>
          {" "}
          + Create Role
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>
            Create Role and Permission
          </h2>
          <button className="btn-sm btn btn-danger" onClick={this.closeModal}>
            close
          </button>
          <form action="" onSubmit={this.addRole}>
            <fieldset className="form-group">
              <h4>Role</h4>
              <input
                className="form-control form-control-md"
                type="text"
                name="role"
                value={this.state.role}
                onChange={this.onChange}
              />
            </fieldset>
            <h4>Resources</h4>
            <fieldset className="form-group">
              <label htmlFor="post">Post</label>
              <input
                className=""
                id="post"
                type="checkbox"
                name="res_post"
                defaultChecked={this.state["res_post"]}
                onChange={this.onChangeCheckBox}
              />{" "}
              <label htmlFor="user">User</label>
              <input
                className=""
                id="user"
                type="checkbox"
                name="res_user"
                defaultChecked={this.state["res_user"]}
                onChange={this.onChangeCheckBox}
              />{" "}
              <label htmlFor="role">Role</label>
              <input
                className=""
                id="role"
                type="checkbox"
                name="res_role"
                defaultChecked={this.state["res_role"]}
                onChange={this.onChangeCheckBox}
              />
            </fieldset>
            <h4>Actions</h4>
            <fieldset>
              <label htmlFor="create">Create</label>
              <input
                className=""
                id="create"
                type="checkbox"
                name="action_create"
                defaultChecked={this.state["action_create"]}
                onChange={this.onChangeCheckBox}
              />{" "}
              <label htmlFor="delete">Delete</label>
              <input
                className=""
                id="delete"
                type="checkbox"
                name="action_delete"
                defaultChecked={this.state["action_delete"]}
                onChange={this.onChangeCheckBox}
              />{" "}
              <label htmlFor="read">Read</label>
              <input
                className=""
                id="read"
                type="checkbox"
                name="action_read"
                defaultChecked={this.state["action_read"]}
                onChange={this.onChangeCheckBox}
              />{" "}
              <label htmlFor="update">Update</label>
              <input
                className=""
                id="update"
                type="checkbox"
                name="action_update"
                defaultChecked={this.state["action_update"]}
                onChange={this.onChangeCheckBox}
              />{" "}
            </fieldset>
            <button className="btn btn-sm btn-success">Add Role</button>
          </form>
        </Modal>
        <div style={{ float: "right" }}>
          <form action="" onSubmit={this.searchUser}>
            <fieldset className="form-group">
              <input
                className="form-control form-control-md"
                type="text"
                name="search"
                value={this.state.search}
                onChange={this.onChange}
              />
              <button className="btn btn-sm btn-info">Search user by Id</button>
            </fieldset>
          </form>
        </div>
        <h1>User Table</h1>
        <UserTable
          users={this.props.users}
          roles={this.props.roles}
          changeRole={this.props.changeRole}
          deleteUser={this.props.deleteUser}
        />
        <br />
        <div style={{ float: "right" }}>
          <form action="" onSubmit={this.deleteRole}>
            <fieldset className="form-group">
              <select
                onChange={this.onChange}
                defaultValue=""
                name="targetRole"
              >
                <option value="" disabled={true}>
                  select role
                </option>
                {option}
              </select>{" "}
              <button className="btn btn-sm btn-danger">Delete Role</button>
            </fieldset>
          </form>
        </div>
        <h1>Authorization Table</h1>
        <RoleTable roles={this.props.roles} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getAllUser: () =>
    dispatch({
      type: GET_ALL_USER,
      payload: agent.Admin.getAllUser()
    }),
  getRoles: () =>
    dispatch({
      type: GET_ROLE,
      payload: agent.Admin.getRoles()
    }),
  changeRole: (userId, role) => {
    dispatch({
      type: SET_ROLE,
      payload: agent.Admin.changeRole(userId, role)
    }),
      dispatch({
        type: GET_ALL_USER,
        payload: agent.Admin.getAllUser()
      });
  },
  deleteRole: role => {
    dispatch({
      type: DELETE_ROLE,
      payload: agent.Admin.deleteRole(role)
    }),
      dispatch({
        type: GET_ALL_USER,
        payload: agent.Admin.getAllUser()
      });
  },
  deleteUser: userId => {
    dispatch({
      type: DELETE_USER,
      payload: agent.Admin.deleteUser(userId)
    }),
      dispatch({
        type: GET_ALL_USER,
        payload: agent.Admin.getAllUser()
      });
  },
  searchUser: userId => {
    dispatch({
      type: GET_USER,
      payload: agent.Admin.searchUser(userId)
    });
  },
  addRole: permissions =>
    dispatch({
      type: SET_PERMISSION,
      payload: agent.Admin.addRole(permissions)
    })
});

const mapStateToProps = state => {
  return {
    users: state.admin.users,
    roles: state.admin.roles
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
