import Papa from "papaparse";
import { saveAs } from "file-saver";

export const exportCSV = (data, fileName = "transactions") => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
};

export const exportJSON = (data, fileName = "transactions") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, `${fileName}.json`);
};
