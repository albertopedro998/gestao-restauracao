const ExcelJS = require("exceljs");
const { resolve } = require("path");
const {
  writeFile,
  unlink,
  mkdir,
  rmdir,
  readFile,
  rename,
  copyFile,
} = require("fs");

const book = new ExcelJS.Workbook();

book.xlsx
  .readFile(
    resolve(
      __dirname,
      "..",
      ".",
      "documentos",
      "relatorios",
      `1764670417069-excel.xlsx`
    )
  )
  .then((res) =>
    res.eachSheet((e, i) => {
      const data = e.getRows(1, e.rowCount).map((e) => e.values);

      //Deletando de arquivos
      /* unlink("test.txt", (err) => {
        if (err) throw err;
        console.log("Deletado com sucesso!");
        }); */
      //Criação e escrita de arquivos
      //writeFile("test.txt", data.join(";").toString(), "utf-8", () => {});

      //leitura de arquivos
      /*  readFile("test.txt", (err, data) => {
        console.log(data.toString("utf8").split(";"));
      }); */

      //copyFile("test.txt", "test2.txt", (err) => {});
    
      //rename("test.txt", "test2.txt", (err) => {});
      //console.log(data);
    })
  );
