const Yup = require("yup");

class FuncionarioMiddleware {
  async create(req, res, next) {
    const { nome, nif, cargo, dtNascimento, password } = req.body;
    let schema = Yup.object({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res
        .status(500)
        .json({ erro: "Nome é obrigatório", campo: "nome" });
    }
    schema = Yup.object({
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid({ password }))) {
      return res.status(500).json({
        erro: "Preencha este campo com 6 ou mais caracteres",
        campo: "senha",
      });
    }
    schema = Yup.object({
      cargo: Yup.string().required(),
    });

    if (!(await schema.isValid({ cargo }))) {
      return res.status(500).json({
        erro: "Selecione um cargo",
        campo: "cargo",
      });
    }
    schema = Yup.object({
      nif: Yup.string()
        .required()
        .matches(/^\d{9}[A-Z]{2}\d{3}$/),
    });

    if (!(await schema.isValid({ nif }))) {
      return res.status(500).json({
        erro: "NIF inválido, siga este padrão [000000000LA000]",
        campo: "nif",
      });
    }

    schema = Yup.object({
      dtNascimento: Yup.date().required(),
    });

    if (!(await schema.isValid({ dtNascimento }))) {
      return res.status(500).json({
        erro: "Selecione a data de nascimento",
        campo: "dtNascimento",
      });
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
