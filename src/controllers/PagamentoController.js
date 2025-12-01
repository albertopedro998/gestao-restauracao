const { Op } = require("sequelize");
const { Pagamento, Caixa, Pedido } = require("../models");

class PagamentoController {
  async index(req, res) {
    let {
      metodo,
      valorPago,
      troco,
      dataPagamento,
      pedidoId,
      caixaId,
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
    if (metodo) {
      where = {
        metodo: {
          [Op.like]: metodo,
        },
      };
    }
    if (pedidoId) {
      where = {
        ...where,
        pedidoId: {
          [Op.eq]: pedidoId,
        },
      };
    }
    if (dataPagamento) {
      where = {
        ...where,
        dataPagamento: {
          [Op.like]: dataPagamento,
        },
      };
    }
    if (troco) {
      where = {
        ...where,
        troco: {
          [Op.eq]: troco,
        },
      };
    }
    if (valorPago) {
      where = {
        ...where,
        valorPago: {
          [Op.eq]: valorPago,
        },
      };
    }
    if (caixaId) {
      where = {
        ...where,
        caixaId: {
          [Op.eq]: caixaId,
        },
      };
    }

    return res.json(
      await Pagamento.findAll({
        include: [Caixa, Pedido],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const pagamento = await Pagamento.findByPk(req.params.id, {});

    return res.json(pagamento);
  }
  async create(req, res) {
    try {
      const pagamento = await Pagamento.create(req.body);

      return res.json(pagamento);
    } catch (error) {
      return res.caixaId(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const pagamento = await Pagamento.findByPk(req.params.id);

    await pagamento.update(req.body);
  }
  async delete(req, res) {
    const pagamento = await Pagamento.findByPk(req.params.id);

    await pagamento.destroy();
  }
}

module.exports = new PagamentoController();
