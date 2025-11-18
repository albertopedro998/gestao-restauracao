const Yup = require("yup");

class FuncionarioMiddleware {
  async create(req, res, next) {
    const { nome, nif } = req.body;
    let schema = Yup.object({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }
    schema = Yup.object({
      nif: Yup.string()
        .required()
        .matches(/^\d{9}[A-Z]{2}\d{3}$/),
    });

    if (!(await schema.isValid({ nif }))) {
      return res
        .status(500)
        .json({ erro: "NIF inválido, siga este padrão [000000000LA000]" });
    }

    return next();
  }

  async update(req, res, next) {
    const { nome, nif } = req.body;
    let schema = Yup.object({
      nome: Yup.string(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }

    schema = Yup.object({
      nif: Yup.string().matches(/^\d{9}[A-Z]{2}\d{3}$/),
    });

    if (!(await schema.isValid({ nif }))) {
      return res
        .status(500)
        .json({ erro: "NIF inválido, siga este padrão [000000000LA000]" });
    }

    return next();
  }
}

module.exports = new FuncionarioMiddleware();
