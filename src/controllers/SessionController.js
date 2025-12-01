const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/auth");
const { Funcionario } = require("../models");
const { promisify } = require("util");

class SessionController {
  async login(req, res) {
    const funcionario = await Funcionario.findOne({
      where: { nif: req.body.nif },
    });

    if (!funcionario) {
      return res.status(401).json({ msg: "email ou senha inválida." });
    }

    if (await funcionario.verifySession(req.body.senha)) {
      const { nome, nif, foto, dtNascimento, cargo :funcao } = funcionario
      return res.json({
        token: jwt.sign({ id: funcionario.id }, secret, { expiresIn }),
        user: {nome, nif, foto, dtNascimento, funcao},
      });
    }
    return res.status(401).json({ msg: "email ou senha inválida." });
  }

  async logout(req, res) {
    return res.json({
      token: "",
    });
  }

  async isLogged(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = await promisify(jwt.verify)(token, secret);
      req.user = await Funcionario.findByPk(decode.id, {
        attributes: { exclude: ["senha"] },
      });
      return next();
    } catch (error) {
      return res.json({ erro: "Usuário não autenticado" });
    }
  }
}

module.exports = new SessionController();
