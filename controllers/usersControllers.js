const { sequelize } = require("../models");
const { Op } = require("sequelize");
// Import DB tabel
const db = require("../models/index");
const users = db.users;
const transactions = db.transactions;
const transactions_details = db.transactions_details;
const items = db.items;
const carts = db.carts;
const category = db.category;
const product = db.product;

//Import Hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

//Import JWT
const { validateToken, createToken } = require("./../lib/jwt");

//import Middleware
const transporter = require("./../helper/transporter");
module.exports = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, password, role } = req.body;
      //1. Validasi passowrd
      let validasiPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}$/;
      if (!password.match(validasiPassword)) {
        return res.status(404).send({
          isError: true,
          message:
            "Password must be contains number and alphabet with minimum 6 character and maximum 10 character",
          data: null,
        });
      }
      //2. Validasi Email
      let validasiEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(validasiEmail)) {
        return res.status(404).send({
          isError: true,
          message: "Email tidak valid",
          data: null,
        });
      }
      //3. Validasi Username & email terhadap DB
      const validiasiUser = await users.findAll({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      });
      if (validiasiUser.length !== 0) {
        return res.status(404).send({
          isError: true,
          message: "Email atau Username sudah terdaftar, silahkan coba lagi ",
          data: null,
        });
      }
      await users.create(
        {
          username,
          email,
          password: await hashPassword(password),
          role,
        },
        { transaction: t }
      );
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "Register Success",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  login: async (req, res) => {
    try {
      let { usernameOrEmail, password } = req.query;
      let findUsernameOrEmail = await users.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      // let cekUsername = await users.findAll({
      //   where: { username : usernameOrEmail },
      // });
      // if (cekUsername.length >= 1) {
      //   res.status(404).send({
      //     isError: false,
      //     message: "Username is already exist, please try another username",
      //   });
      // }
      if (!findUsernameOrEmail.dataValues) {
        return res.status(404).send({
          isError: true,
          message: "Username or Email Not Found",
          data: null,
        });
      }
      console.log(findUsernameOrEmail.dataValues);
      if (findUsernameOrEmail.dataValues.access == "disable") {
        res.status(404).send({
          isError: true,
          message: "Status Akun anda disable, mohon hubungin admin",
          data: null,
        });
      }
      let hasMatchResult = await hashMatch(
        password,
        findUsernameOrEmail.dataValues.password
      );
      if (hasMatchResult === false) {
        return res.status(404).send({
          isError: true,
          message: "Password Not Valid",
          data: true,
        });
      }
      res.status(200).send({
        isError: true,
        message: "Login Success",
        data: {
          token: createToken({
            id: findUsernameOrEmail.dataValues.id,
            role: findUsernameOrEmail.dataValues.role,
            access: findUsernameOrEmail.dataValues.access,
          }),
        },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  changePassword: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, oldPassword, newPassword } = req.body;
      let findUser = await users.findAll({
        where: {
          username,
          email,
        },
      });
      console.log(findUser);
      let validasiPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}$/;
      if (!newPassword.match(validasiPassword)) {
        return res.status(404).send({
          isError: true,
          message:
            "Password must be contains number and alphabet with minimum 6 character and maximum 10 character",
          data: null,
        });
      }
      if (newPassword == oldPassword) {
        return res.status(404).send({
          isError: true,
          message: "oldPassword cannot same with new Password",
          data: null,
        });
      }
      if (findUser.length == 0) {
        return res.status(404).send({
          isError: true,
          message: "username or email is not valid",
          data: null,
        });
      }
      console.log(findUser[0].dataValues.password);
      let hasMatchResult = await hashMatch(
        oldPassword,
        findUser[0].dataValues.password
      );
      if (hasMatchResult === false) {
        return res.status(404).send({
          isError: true,
          message: "Password Not Valid",
          data: true,
        });
      }
      let users_id = findUser[0].dataValues.id;
      // console.log(users_id);
      await users.update(
        {
          password: await hashPassword(newPassword),
        },
        { where: { id: users_id, username, email } },
        { transaction: t }
      );
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "Change password is success",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getDataUser: async (req, res) => {
    try {
      const token = req.headers.auth;
      let data = validateToken(token);
      console.log(data);
      if (data.role !== "admin") {
        res.status(404).send({
          isError: true,
          message: "Role tidak diizinkan",
          data: null,
        });
      }
      if (data.access !== "enable") {
        res.status(404).send({
          isError: true,
          message: "Akses tidak diizinkan",
          data: null,
        });
      }
      let dataUser = await users.findAll({
        attributes: ["id", "username", "email", "password", "role", "access"],
      });
      // console.log(dataUser);
      res.status(200).send({
        isError: false,
        message: "List User",
        data: dataUser,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  modify: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { username, email, role, access } = req.body;
      let { id } = req.params;
      const token = req.headers.auth;
      let data = validateToken(token);
      console.log(data);
      if (data.role !== "admin") {
        res.status(404).send({
          isError: true,
          message: "Role tidak diizinkan",
          data: null,
        });
      }
      if (data.access !== "enable") {
        res.status(404).send({
          isError: true,
          message: "Akses tidak diizinkan",
          data: null,
        });
      }
      let validasiEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(validasiEmail)) {
        return res.status(404).send({
          isError: true,
          message: "Email tidak valid",
          data: null,
        });
      }
      await users.update(
        {
          username,
          email,
          role,
          access,
        },
        { where: { id } },
        { transaction: t }
      );
      res.status(200).send({
        isError: false,
        message: "Update data success",
        data: null,
      });
      await t.commit();
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
