const { Op } = require("sequelize");
const { Mesa } = require("../models");

class MesaController {
  async index(req, res) {
    let { numero, status, empresaId, limit, page, sort } = req.query;
    limit = limit | 25;
    page = page | 1;
    let where = {};
    let order = [];
    if (sort) {
      for (const row of sort.split(";")) {
        order.push(row.split(":"));
      }
    }
    if (numero) {
      where = {
        numero: {
          [Op.eq]: numero,
        },
      };
    }
    if (status) {
      where = {
        ...where,
        status: {
          [Op.like]: status,
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
      await Mesa.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const mesa = await Mesa.findByPk(req.params.id, {});

    return res.json(mesa);
  }
  async create(req, res) {
    try {
      const mesa = await Mesa.create(req.body);

      return res.json(mesa);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const mesa = await Mesa.findByPk(req.params.id);

    try {
      await mesa.update(req.body);
      return res.json({ sucesso: "Operação realizada com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ sucesso: "Não foi possível realizar esta operação" });
    }
  }
  async delete(req, res) {
    const mesa = await Mesa.findByPk(req.params.id);

    try {
      await mesa.destroy();
      return res.json({ sucesso: "Operação realizada com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ sucesso: "Não foi possível realizar esta operação" });
    }
  }
}

module.exports = new MesaController();
