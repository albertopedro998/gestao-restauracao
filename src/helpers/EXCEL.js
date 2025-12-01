const ExcelJS = require("exceljs");

class Excel {
  createBook(name, columns = []) {
    //INSTACIANDO A PLANILHA
    this.book = new ExcelJS.Workbook();

    //CRIANDO UMA FOLHA DE ESTILO E ADICIONANDO COLUNAS A ELA
    this.sheet = this.book.addWorksheet(name);
    this.sheet.columns = columns;
  }

  newRow(data) {
    this.sheet.addRow(data);
  }

  saveBook(name) {
    this.book.xlsx.writeFile(`${name}.xlsx`);
  }
}

module.exports = new Excel();
