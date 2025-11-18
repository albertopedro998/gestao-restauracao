const Yup = require("yup");

class FornedorMiddleware {
  async create(req, res, next) {
    const { nome, telefone, email, nif } = req.body;
    let schema = Yup.object({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }
    schema = Yup.object({
      telefone: Yup.string()
        .required()
        .matches(/^[9]\d{8}$/),
    });

    if (!(await schema.isValid({ telefone }))) {
      return res
        .status(500)
        .json({ erro: "telefone inválido" });
    }
    schema = Yup.object({
      email: Yup.string().required().email(),
    });

    if (!(await schema.isValid({ email }))) {
      return res.status(500).json({ erro: "Email é obrigatório" });
    }
    schema = Yup.object({
      nif: Yup.string()
        .matches(/^\d{9}[A-Z]{2}\d{3}$/)
        .required(),
    });

    if (!(await schema.isValid({ nif }))) {
      return res
        .status(500)
        .json({ erro: "NIF inválido, siga este padrão [000000000LA000]" });
    }
    return next();
  }

  async update(req, res, next) {
    const { nome, telefone, email, nif } = req.body;
    let schema = Yup.object({
      nome: Yup.string(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }

    schema = Yup.object({
      telefone: Yup.string().matches(/^9\d{8}$/),
    });

    if (!(await schema.isValid({ telefone }))) {
      return res
        .status(500)
        .json({ erro: "telefone inválido, siga este padrão [000000000LA000]" });
    }
    schema = Yup.object({
      email: Yup.string().email(),
    });

    if (!(await schema.isValid({ email }))) {
      return res.status(500).json({ erro: "Email é obrigatório" });
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

module.exports = new FornedorMiddleware();
