class Pedido {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll(query = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Pedido.DATA = await fetch(
      `${this.BASE_URL}/pedidos?empresaId=${empresaId}&${query}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Pedido.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Pedido.DATA = await fetch(
      `${this.BASE_URL}/pedidos?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Pedido.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/pedidos/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async create(data) {
    return await fetch(`${this.BASE_URL}/pedidos`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async createItem(data) {
    return await fetch(`${this.BASE_URL}/produtospedidos`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async getItemsOnPedido(id) {
    return await fetch(`${this.BASE_URL}/produtospedidos?pedidoId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/pedidos/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
