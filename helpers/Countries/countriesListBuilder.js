const fs = require('fs')
const countries = require('../../data/Countries/countriesListArray.js')

const COUNTRY_DATA_GETTERS  = require('./countriesFunctions')
const COUNTRY_PROPERTIES = Object.keys(COUNTRY_DATA_GETTERS);

const setCountryObject = (currentCountry) =>{

  const country = require(`../../data/Countries/countriesData/${currentCountry}.json`);
  
  const countryData = {}

  COUNTRY_PROPERTIES.forEach(property => {
  const obj = { [property]: COUNTRY_DATA_GETTERS[property](country)}
  let newCountryData = Object.assign(countryData, obj)
  return newCountryData
  })

  const data = {
    [currentCountry]:  countryData 
  };
  return data
  
}

const createCountriesJson = (countries) =>{
  const countriesData = []

  countries.map(country =>{
    countriesData.push(setCountryObject(country))
  })

  const data = JSON.stringify(countriesData, null, 2);

  fs.writeFile('data/Countries/Countries.json', data, (err) => {
  if (err) throw err;
  });

}


const create = () => createCountriesJson(countries)

module.exports = create

