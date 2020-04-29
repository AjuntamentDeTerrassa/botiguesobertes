// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Vuex from 'vuex'
import store from '../store'
import MiniSearch from 'minisearch'

require('~/assets/global.css')
require('leaflet/dist/leaflet.css')

export default function (Vue, { head, isClient, appOptions }) {
  head.link.push({
    href:
      'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap',
    rel: 'stylesheet',
  })

  head.meta.push({
    name: 'theme-color',
    content: '#000000',
  })

  if (isClient) {
    let L = require('leaflet')

    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    })
  }

  Vue.use(Vuex)
  appOptions.store = new Vuex.Store(store)

  Vue.prototype.$search = new MiniSearch({
    fields: ['name', 'type', 'displayAddress'],
    searchOptions: {
      boost: { title: 10, type: 5, displayAddress: 1 },
      fuzzy: 0.1,
      prefix: true,
    },
  })
}
