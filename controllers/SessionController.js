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
      return res.json({
        token: jwt.sign({ id: funcionario.id }, secret, { expiresIn }),
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
      return next();
    } catch (error) {
      return res.json({ erro: "Usuário não autenticado" });
    }
  }
}

module.exports = new SessionController();
