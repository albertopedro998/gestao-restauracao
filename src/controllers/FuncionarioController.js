const { Op } = require("sequelize");
const { Funcionario } = require("../models");
const bcrypt = require("bcryptjs");
class FuncionarioController {
  async index(req, res) {
    let { nome, email, dtNascimento, limit, page, sort } = req.query;
    limit = parseInt(limit) || 1000;
    page = page || 1;
    let where = {};
    let order = [];
    if (sort) {
      for (const row of sort.split(";")) {
        order.push(row.split(":"));
      }
    }
    if (nome) {
      where = {
        nome: {
          [Op.like]: nome,
        },
      };
    }
    if (email) {
      where = {
        ...where,
        email: {
          [Op.like]: email,
        },
      };
    }
    if (dtNascimento) {
      where = {
        ...where,
        dtNascimento: {
          [Op.like]: dtNascimento,
        },
      };
    }
    return res.json(
      await Funcionario.findAll({
        attributes: { exclude: ["senha"] },
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id, {
      attributes: { exclude: ["senha"] },
    });

    return res.json(funcionario);
  }
  async create(req, res) {
    try {
      const userExists = await Funcionario.findOne({
        where: { nif: req.body.nif },
      });

      if (userExists) {
        return res
          .status(500)
          .json({ erro: "Já existe este NIF na base de dados", campo: "nif" });
      }
      req.body.senha = await bcrypt.hash(req.body.password, 8);
      const funcionario = await Funcionario.create(req.body);

      return res.json(funcionario);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id);

    try {
      await funcionario.update(req.body);
      return res.json({ sucesso: "Sucesso" });
    } catch (e) {
      return res.status(501).json({ erro: "Erro ao atualizar" });
    }
  }
  async delete(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id);

    try {
      await funcionario.destroy();
      return res.json({ sucesso: "Sucesso" });
    } catch (e) {
      return res.status(501).json({ erro: "Erro ao excluir" });
    }
  }
}

module.exports = new FuncionarioController();
