// @ts-check

const EventStore = require('orbit-db-eventstore')

class LogStore extends EventStore {
  constructor(ipfs, id, dbname, options) {
    super(ipfs, id, dbname, options)
    this._type = LogStore.type
  }

  add(data, options = {}) {
    options = Object.assign({}, { pin: true }, options)
    return this._addOperation(data, options)
  }

  static get type() {
    return '232c:logstore'
  }
}

module.exports = LogStore
