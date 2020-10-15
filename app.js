const createCountriesJson = require('./helpers/Countries/countriesListBuilder');
const createBuildingsJson = require('./helpers/Buildings/buildingsListBuilder');
const csvBuildings = "./data/Buildings/BuildingsCSV.csv";


createCountriesJson()
createBuildingsJson(csvBuildings, "Buildings.json");
