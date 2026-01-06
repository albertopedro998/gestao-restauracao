class Fornecedor {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Fornecedor.DATA = await fetch(
      `${this.BASE_URL}/fornecedores?empresaId=${empresaId}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    return Fornecedor.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Fornecedor.DATA = await fetch(
      `${this.BASE_URL}/fornecedores?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    return Fornecedor.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/fornecedores/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/fornecedores`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/fornecedores/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/fornecedores/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
