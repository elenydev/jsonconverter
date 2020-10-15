const fs = require("fs");
const csvConverter = require("csvtojson");


const convertToJson = async (baseFile, outputFileName) => {
  const jsonOutput = await csvConverter()
    .fromFile(baseFile)
    .then((jsonObject) => {
      const data = JSON.stringify(jsonObject, null, 2);

      fs.writeFile('data//Buildings/'+outputFileName, data, (err, data) => {
        if (!err) return data;

        console.log(err);
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

module.exports = convertToJson