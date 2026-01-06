const { Op } = require("sequelize");
const { Categoria } = require("../models");

class CategoriaController {
  async index(req, res) {
    let { nome, empresaId, limit, page, sort } = req.query;
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
    if (empresaId) {
      where = {
        empresaId: {
          [Op.eq]: empresaId,
        },
      };
    }

    return res.json(
      await Categoria.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const categoria = await Categoria.findByPk(req.params.id, {});

    return res.json(categoria);
  }
  async create(req, res) {
    try {
      const categoria = await Categoria.create(req.body);

      return res.json(categoria);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const categoria = await Categoria.findByPk(req.params.id);

    await categoria.update(req.body);
  }
  async delete(req, res) {
    const categoria = await Categoria.findByPk(req.params.id);

    await categoria.destroy();
  }
}

module.exports = new CategoriaController();
