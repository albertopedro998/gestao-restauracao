$(function (ev) {
  const user = JSON.parse(localStorage.getItem("user"));
  $(".userImg").attr({ src: `/src/uploads/${user.foto}` });
  $(".userName").text(`${user.nome}`);
  $(".userFuncao").text(`${user.funcao}`);
  $(".userNif").text(`NIF: ${user.nif}`);
  $("#btnLogout, .btnLogout").click(function (ev) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pedidos");
  });
});
