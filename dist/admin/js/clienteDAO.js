class Cliente {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    Cliente.DATA = await fetch(`${this.BASE_URL}/clientes`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    return Cliente.DATA;
  }
  async index(sqlQuery = "") {
    Cliente.DATA = await fetch(`${this.BASE_URL}/clientes?${sqlQuery}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    return Cliente.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/clientes/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/clientes`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/clientes/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
