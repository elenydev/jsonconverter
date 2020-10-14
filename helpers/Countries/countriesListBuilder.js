const { count } = require('console');
const fs = require('fs')
const countries = require('../../data/countriesListArray')

const removeDate = (data) => data.replace(/\(.*\)/,'').replace('years','').trim();
const removeBrackets = (data) =>  data.split('(').join('').split(')').join('')
const getValue = (data) => data.substring(data.lastIndexOf(" ") + 1);
const removeEmptyElementsInArray = (arr) => arr.filter((e) => e != null);


const FIRST_NUMBER_IN_STRING= /\d+\.\d+|\d+\b|\d+(?=\w)/g
const REMOVE_ALL_BETWEEN_BRACKETS = / *\([^)]*\) */g
const SELECT_FIRST_NUMERIC = /\d/


const createReligionsArray = (array) =>{
  const arr = array.replace(REMOVE_ALL_BETWEEN_BRACKETS,'')

  const religions = arr.split(',').map(el =>{
    const element = el.trim()
    const name = element.split(SELECT_FIRST_NUMERIC)[0].trim();
    let value = el.match(FIRST_NUMBER_IN_STRING)
    
    if(value !== null){
      value = +value[0] 

      const data = {
      [name] : value}

      return data
    }
    else{
      value = ''
    }
    })

  return removeEmptyElementsInArray(religions)
}


const setCountryObject = (currentCountry) =>{

  const country = require(`../../countriesData/${currentCountry}.json`);

  const { Geography , Economy } = country;
  const peopleAndSociety = country["People and Society"];
  const economyOrigin = Economy["GDP - composition, by sector of origin"];
  const forest = Geography["Land use"];
  const lifeExpectancyAtBirth = peopleAndSociety["Life expectancy at birth"]
  const religions = country["People and Society"].Religions.text;
  const perCapita = Economy["GDP - per capita (PPP)"];
  const naturalResources = Geography["Natural resources"].text;
  const enviromentIssues = Geography["Environment - current issues"];
  const populationGrowthRate = peopleAndSociety["Population growth rate"];


  const religionsData = createReligionsArray(religions);
  const perCapitaData = perCapita &&  perCapita.text?.split("++").map(el =>{
    const element = el.trim('billion');
    const value = (element.split(" ")[0]).replace(',','.')
    return value
  });

  const data = {
    [currentCountry] :{

      climate : Geography.Climate.text,

      ...(naturalResources && {naturalResources: naturalResources.split(',')}),

      ...(forest && {forest : parseFloat(forest.forest.text)}),

      ...(enviromentIssues && {enviromentIssues: enviromentIssues.text}),

      population: removeDate(peopleAndSociety.Population.text),

      ...(religions.includes('%') && {religions : religionsData}),

      ...(populationGrowthRate && {populationGrowthRate: parseFloat(removeDate(populationGrowthRate.text))}),
      ...(lifeExpectancyAtBirth && {
          lifeExpectancyAtBirth: {
            totalPopulation : +removeDate(lifeExpectancyAtBirth["total population"].text),
            male : +removeDate(lifeExpectancyAtBirth.male.text),
            female : +removeDate(lifeExpectancyAtBirth.female.text)
          }
      }),

      purshasingPowerParity : Economy["GDP (purchasing power parity)"].text.split('++').map(el => removeDate(el)),

      ...( perCapita && {perCapita: perCapitaData}),

      ...(economyOrigin && {
        compositionBySectorOfOrigin:{
          agriculture : +economyOrigin.agriculture.text.split('%')[0],
          industry : +economyOrigin.industry.text.split('%')[0],
          services : +economyOrigin.services.text.split('%')[0],
        }
      })
    },
  }
  return data
  
}

const createCountriesJson = (countries) =>{
  const countriesData = []

  countries.map(country =>{
    countriesData.push(setCountryObject(country))
  })

  const data = JSON.stringify(countriesData, null, 2);

  fs.writeFile('data/Countries.json', data, (err) => {
  if (err) throw err;
  });

}


const create = () => createCountriesJson(countries)

module.exports = create

