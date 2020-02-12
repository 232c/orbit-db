
const LogStore = require('./232c-logstore')
const OrbitDB = require('../OrbitDB')

OrbitDB.addDatabaseType(LogStore.type, LogStore)

/** 232c-db logstore */
OrbitDB.prototype.logstore = function (address, options = {}) {
  options = Object.assign({
    create: true,
    format: 'dag-pb',
    type: LogStore.type,
    accessController: {
      write: ['*']
    }
  }, options)
  return this.open(address, options)
}
