const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/auth");
const { Funcionario, Empresa, User } = require("../models");
const { promisify } = require("util");

class SessionController {
  async login(req, res) {
    const user = await User.findOne({
      where: { NIF: req.body.nif },
      include: [Funcionario, Empresa],
    });

    if (!user) {
      return res.status(401).json({ msg: "email ou senha inválida." });
    }

    if (await user.verifySession(req.body.senha)) {
      var { id, nome, NIF: nif, dtNascimento } = user;
      if (user.Funcionarios.length) {
        var {
          id,
          nome,
          foto,
          dtNascimento,
          cargo: funcao,
          empresaId: empresa,
        } = user.Funcionarios[0];
      } else {
        var { nome, id: empresa, logotipo: foto } = user.Empresas[0];
        funcao = "Admin";
      }
      return res.json({
        token: jwt.sign({ id: user.id, funcao, empresa }, secret, {
          expiresIn,
        }),
        user: { id, nome, nif, empresa, foto, dtNascimento, funcao },
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
