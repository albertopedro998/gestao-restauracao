const { Op } = require("sequelize");
const { Cardapio } = require("../models");

class CardapioController {
  async index(req, res) {
    let { nome, limit, page, sort } = req.query;
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
          [Op.eq]: nome,
        },
      };
    }

    return res.json(
      await Cardapio.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const cardapio = await Cardapio.findByPk(req.params.id, {});

    return res.json(cardapio);
  }
  async create(req, res) {
    try {
      const cardapio = await Cardapio.create(req.body);

      return res.json(cardapio);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const cardapio = await Cardapio.findByPk(req.params.id);

    try {
      await cardapio.update(req.body);
      return res.json({ mensagem: "Operação realizada com sucesso" });
    } catch (e) {
      return res
        .status(500)
        .json({ erro: "Não foi possíver realizar a operação" });
    }
  }
  async delete(req, res) {
    const cardapio = await Cardapio.findByPk(req.params.id);

    try {
      await cardapio.destroy();
      return res.json({ mensagem: "Operação realizada com sucesso" });
    } catch (e) {
      return res
        .status(500)
        .json({ erro: "Não foi possíver realizar a operação" });
    }
  }
}

module.exports = new CardapioController();
