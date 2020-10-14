const fs = require("fs");

const csvBuildings = "BuildingsCSV.csv";
const csvConverter = require("csvtojson");
const createCountriesJson = require('./helpers/Countries/countriesListBuilder');

const convertToJson = async (baseFile, outputFileName) => {
  const jsonOutput = await csvConverter()
    .fromFile(baseFile)
    .then((jsonObject) => {
      const data = JSON.stringify(jsonObject, null, 2);

      fs.writeFile('data/'+outputFileName, data, (err, data) => {
        if (!err) return data;

        console.log(err);
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

createCountriesJson()
convertToJson(csvBuildings, "Buildings.json");
