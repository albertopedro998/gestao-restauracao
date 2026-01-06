const { Op } = require("sequelize");
const { Caixa, Funcionario } = require("../models");

class CaixaController {
  async index(req, res) {
    let {
      dataAbertura,
      dataFechamento,
      saldoInicial,
      saldoFinal,
      empresaId,
      funcionarioId,
      status,
      limit,
      page,
      sort,
    } = req.query;
    limit = limit | 25;
    page = page | 1;
    let where = {};
    let order = [];
    if (sort) {
      for (const row of sort.split(";")) {
        order.push(row.split(":"));
      }
    }
    if (dataAbertura) {
      where = {
        dataAbertura: {
          [Op.eq]: dataAbertura,
        },
      };
    }
    if (funcionarioId) {
      where = {
        ...where,
        funcionarioId: {
          [Op.like]: funcionarioId,
        },
      };
    }
    if (saldoFinal) {
      where = {
        ...where,
        saldoFinal: {
          [Op.like]: saldoFinal,
        },
      };
    }
    if (saldoInicial) {
      where = {
        ...where,
        saldoInicial: {
          [Op.like]: saldoInicial,
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
    if (dataFechamento) {
      where = {
        ...where,
        dataFechamento: {
          [Op.like]: dataFechamento,
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

    return res.json(
      await Caixa.findAll({
        include: [Funcionario],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const caixa = await Caixa.findByPk(req.params.id, {});

    return res.json(caixa);
  }
  async create(req, res) {
    try {
      const caixa = await Caixa.create(req.body);

      return res.json(caixa);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const caixa = await Caixa.findByPk(req.params.id);

    await caixa.update(req.body);
  }
  async delete(req, res) {
    const caixa = await Caixa.findByPk(req.params.id);

    await caixa.destroy();
  }
}

module.exports = new CaixaController();
