const removeDate = (data) => data.toString().replace(/\(.*\)/,'').replace('years','').trim();
const removeEmptyElementsInArray = (arr) => arr.filter((e) => e != null);

const getClimate = country => country.Geography.Climate.text;

const getNaturalResoureces = country => {
  const naturalResources = country.Geography["Natural resources"].text;
  if(naturalResources) return naturalResources.split(',')
};

const getForest = country => {
  const forest = country.Geography["Land use"];
  if(forest) return parseFloat(forest.forest.text)
};

const getEnviromentIssues = country => {
  const enviromentIssues= country.Geography["Environment - current issues"]
  if(enviromentIssues) return enviromentIssues.text
};

const getPopulation = country => {
  const population = country["People and Society"].Population.text;
  if(population) return removeDate(population)
};

const getReligions = country => {
  const religions = country["People and Society"].Religions.text;
  if(religions.includes('%')){
    religions.replace(REMOVE_ALL_BETWEEN_BRACKETS,'')
    const religionsArray = religions.split(',').map(el =>{
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
  
    return removeEmptyElementsInArray(religionsArray)
  }
  else{
    return null
  }
};

const getPopulationGrowthRate = country => {
  const populationGrowthRate = country["People and Society"]["Population growth rate"];
  if(populationGrowthRate) return parseFloat(removeDate(populationGrowthRate.text))
};

const getLifeExpectancyAtBirth = country => {
  const lifeExpectancyAtBirth = country["People and Society"]["Life expectancy at birth"]
  if(lifeExpectancyAtBirth){
  const dataObject = {
    totalPopulation: Number(removeDate(lifeExpectancyAtBirth["total population"].text)),
    male: Number(removeDate(lifeExpectancyAtBirth.male.text)),
    female: Number(removeDate(lifeExpectancyAtBirth.female.text)),
  }
  return dataObject
  };
};

const getPurchasingPowerParity = country => country.Economy["GDP (purchasing power parity)"].text.split('++').map(el => removeDate(el));

const getPerCapita = country => {
  const perCapita = country.Economy["GDP - per capita (PPP)"]
  if(perCapita){
    const data = perCapita.text.split("++").map(el =>{
      const element = el.trim('billion');
      const value = (element.split(" ")[0]).replace(',','.')
      return value
    });
    return data
  }
};

const getEconomyOrigin = country => {
  const economyOrigin = country.Economy["GDP - composition, by sector of origin"]
  if(economyOrigin){
  const dataObject = {
    agriculture : Number(economyOrigin.agriculture.text.split('%')[0]),
    industry : Number(economyOrigin.industry.text.split('%')[0]),
    services : Number(economyOrigin.services.text.split('%')[0]),
  }
  return dataObject
  }
};



const FIRST_NUMBER_IN_STRING= /\d+\.\d+|\d+\b|\d+(?=\w)/g
const REMOVE_ALL_BETWEEN_BRACKETS = / *\([^)]*\) */g
const SELECT_FIRST_NUMERIC = /\d/
const COUNTRY_DATA_GETTERS = {
  climate: getClimate,
  naturalResources: getNaturalResoureces,
  forest: getForest,
  enviromentIssues: getEnviromentIssues,
  population: getPopulation,
  religions: getReligions,
  populationGrowthRate: getPopulationGrowthRate,
  lifeExpectancyAtBirth: getLifeExpectancyAtBirth,
  purshasingPowerParity: getPurchasingPowerParity,
  perCapita : getPerCapita,
  economyOrigin: getEconomyOrigin
}

module.exports = COUNTRY_DATA_GETTERS