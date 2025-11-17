const { Op } = require("sequelize");
const { Funcionario } = require("../models");

class FuncionarioController {
  async index(req, res) {
    let { nome, email, limit, page, sort } = req.query;
    limit = limit | 25;
    page = page | 1;
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
    return res.json(
      await Funcionario.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id, {});

    return res.json(funcionario);
  }
  async create(req, res) {
    try {
      const funcionario = await Funcionario.create(req.body);

      return res.json(funcionario);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id);

    await funcionario.update(req.body);
  }
  async delete(req, res) {
    const funcionario = await Funcionario.findByPk(req.params.id);

    await funcionario.destroy();
  }
}

module.exports = new FuncionarioController();
