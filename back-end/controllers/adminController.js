const UserModel = require("../models/UserModel");

const load_platform_users = async (req, res) => {
  try {
    let users = await UserModel.findAll({
      attributes: { exclude: ["password", "salt"] },
    }).then((users) => users.map((user) => user.dataValues));

    return res.status(200).send({
      ok: true,
      status: 200,
      message: "Success",
      payload: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const update_user_profile = async (req, res) => {
  try {
    let user_id = req.params.user_id;
    let { username, email, contact_number, account_type } = req.body;

    let user = await UserModel.findOne({ where: { id: user_id } });

    if (!user) {
      return res.status(400).send({
        ok: false,
        status: 400,
        message: "User not found",
      });
    }

    let update = await UserModel.update(
      {
        username: username,
        email: email,
        contact_number: contact_number,
        account_type: account_type,
      },
      {
        where: { id: user_id },
      }
    );

    if (update) {
      return res.status(200).send({
        ok: true,
        status: 200,
        message: "User updated",
      });
    }

    return res.status(400).send({
      status: 400,
      ok: false,
      message: "User not updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const load_user_profile_by_id = async (req, res) => {
  try {
    let { user_id } = req.params;

    let user = await UserModel.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password", "salt"] },
    });

    if (!user) {
      return res.status(400).send({
        ok: false,
        status: 400,
        message: "User not found",
      });
    }

    return res.status(200).send({
      ok: true,
      status: 200,
      message: "Success",
      payload: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      ok: false,
      message: "Internal Server Error",
    });
  }
};

const delete_user_by_username = async (req, res) => {
  const { username } = req.body;
  console.log(`Deleiting: ${username}`);

  try {
    // Find and delete the user by username
    const result = await UserModel.destroy({
      where: {
        username: username,
      },
    });

    if (result === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  load_platform_users,
  update_user_profile,
  load_user_profile_by_id,
  delete_user_by_username,
};
