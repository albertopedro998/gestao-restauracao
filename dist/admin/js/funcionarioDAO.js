class Funcionario {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Funcionario.DATA = await fetch(
      `${this.BASE_URL}/funcionarios?empresaId=${empresaId}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Funcionario.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Funcionario.DATA = await fetch(
      `${this.BASE_URL}/funcionarios?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Funcionario.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/funcionarios/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/funcionarios`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/funcionarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/funcionarios/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
