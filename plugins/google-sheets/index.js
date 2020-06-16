/* eslint-disable no-console */
const { google } = require('googleapis')
const { Client, Status } = require('@googlemaps/google-maps-services-js')
const storage = require('node-persist')

async function geocode(address, mapsClient, key) {
  console.log(`Geocoding ${address}...`)

  try {
    let response = await mapsClient.geocode({
      params: {
        address: `${address}, Terrassa, Catalunya`,
        key,
      },
    })

    if (response.data.status === Status.OK) {
      return response.data.results[0].geometry.location
    } else {
      console.log(response.data)
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

let stateMappings = {
  Sí: 'YES',
  No: 'NO',
  Parcialment: 'PARTIALLY',
}

function normalizeShop(shop) {
  return {
    address: shop['Adreça del local (Carrer i número)'],
    displayAddress: shop['Adreça del local (Carrer i número)'],
    postalCode:
      shop["Districte: (en cas de no conèixe'l, indicar codi postal)"],
    display:
      shop[
        "Podriem fer públic a la pàgina web de l'Ajuntament www.terrassa.cat i a través del 010, que el seu negoci està operatiu/obert o presta servei ara o més endavant ? "
      ] == 'Sí',
    city: shop['Població'],
    phone: shop['Telèfon de contacte'],
    email: shop['Email'],
    ships: stateMappings[shop['Fas enviament a domicili ?']],
    shippingConditions: shop['Com fem comandes?'],
    name: shop['Nom del teu comerç/establiment'],
    type: shop['Tipologia'],
    openState: stateMappings[shop['Tens obert?']],
    openConditions: shop['En quines condicions?'],
  }
}

class GoogleSheetSource {
  static defaultOptions() {
    return {
      sheetId: '',
      sheetsKey: '',
      mapsKey: '',
      type: 'googleSheet',
    }
  }

  constructor(api, options = GoogleSheetSource.defaultOptions()) {
    this.options = options

    const mapsClient = new Client({})

    api.loadSource(async (store) => {
      const contentType = store.addCollection({
        typeName: this.options.type,
      })

      const sheets = google.sheets({
        version: 'v4',
        auth: this.options.sheetsKey,
      })

      await sheets.spreadsheets.values
        .get({
          spreadsheetId: this.options.sheetId,
          range: 'A1:ZZ10000',
        })
        .then(async (response) => {
          const data = response.data.values
          const titles = data.shift()
          const nodes = data.map((value) => {
            return normalizeShop(
              titles.reduce(
                (title, key, index) => ({ ...title, [key]: value[index] }),
                {}
              )
            )
          })

          await storage.init({
            dir: '.geocoder-cache',
          })

          for (const value of nodes) {
            let address = `${value.address}, ${value.postalCode}, ${value.city}, Spain`

            let coordinates = await storage.getItem(address)
            if (!coordinates) {
              coordinates = await geocode(address, mapsClient, options.mapsKey)
              storage.setItem(address, coordinates)
            }

            value.coordinates = coordinates

            contentType.addNode(value)
          }
        })
        .catch((err) => console.log(err))
    })
  }
}

module.exports = GoogleSheetSource
