const { Op } = require("sequelize");
const { Cliente } = require("../models");

class ClienteController {
  async index(req, res) {
    let { nome, email, empresaId, limit, page, sort } = req.query;
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
    if (empresaId) {
      where = {
        ...where,
        empresaId: {
          [Op.eq]: empresaId,
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

    try {
      await cliente.update(req.body);
      return res.json({ mensagem: "sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível realizar esta operação" });
    }
  }
  async delete(req, res) {
    const cliente = await Cliente.findByPk(req.params.id);

    try {
      await cliente.destroy();
      return res.json({ mensagem: "sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível realizar esta operação" });
    }
  }
}

module.exports = new ClienteController();
