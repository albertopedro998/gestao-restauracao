const { Op } = require("sequelize");
const { Cliente } = require("../models");

class ClienteController {
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
      await Cliente.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const cliente = await Cliente.findByPk(req.params.id, {});

    return res.json(cliente);
  }
  async create(req, res) {
    try {
      const cliente = await Cliente.create(req.body);

      return res.json(cliente);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const cliente = await Cliente.findByPk(req.params.id);

    await cliente.update(req.body);
  }
  async delete(req, res) {
    const cliente = await Cliente.findByPk(req.params.id);

    await cliente.destroy();
  }
}

module.exports = new ClienteController();
