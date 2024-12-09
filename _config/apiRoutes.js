const moduleName = 'iorder';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase: urlBase,
  version: moduleVersion, 
  orders: `${urlBase}/orders`,
  items: `${urlBase}/items`,
  supplies: `${urlBase}/supplies`,
  types: `${urlBase}/types`,
  statuses: `${urlBase}/statuses`,
  
}
