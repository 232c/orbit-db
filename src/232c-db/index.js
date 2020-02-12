
const OrbitDB = require('../OrbitDB')

const LogStore = require('./232c-logstore')
OrbitDB.addDatabaseType(LogStore.type, LogStore)

const AccessControllers = require('orbit-db-access-controllers')
const Celsius232AC = require('./access-controller')
AccessControllers.addAccessController({ AccessController: Celsius232AC })

class Celsius232DB {

  /** @type {OrbitDB} */
  _orbitdb = null;

  static async createInstance(ipfs, options = {}) {
    options = Object.assign({
      AccessControllers: AccessControllers
    }, options)

    const instance = new this()
    instance._orbitdb = await OrbitDB.createInstance(ipfs, options)

    return instance
  }

  disconnect() {
    return this._orbitdb.disconnect()
  }

  stop() {
    return this._orbitdb.stop()
  }

  logstore(address, options = {}) {
    options = Object.assign({
      create: true,
      format: 'dag-pb',
      pin: true,
      type: LogStore.type,
      accessController: {
        type: '232c',
        callback: options.acCallback || undefined
      }
    }, options)
    return this._orbitdb.open(address, options)
  }

  createDataStore(name, metaData = null, acCallback = undefined) {
    return this.logstore(name, {
      meta: metaData,
      acCallback,
    })
  }

  openDataStore(address, options = {}) {
    return this.logstore(address, options)
  }

}

module.exports = Celsius232DB
