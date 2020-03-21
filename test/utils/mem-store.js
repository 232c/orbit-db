'use strict'

const CID = require('cids')
const Block = require("ipfs-block")

const cidifyString = (str) => {
  if (!str) {
    return str
  }

  if (Array.isArray(str)) {
    return str.map(cidifyString)
  }

  return new CID(str)
}

/**
 * Memory store using an LRU cache
 * as the blockService (js-ipfs-block-service) for ipld
 */
class MemStore {
  constructor() {
    this._store = new Map()
  }

  /**
   * @param {Block} block 
   */
  async put(block) {
    const value = block.data
    const key = block.cid.toBaseEncodedString('base58btc')
    this._store.set(key, value)
  }

  /**
   * @param {CID} cid 
   */
  async get(cid) {
    const key = cid.toBaseEncodedString('base58btc')
    const data = this._store.get(key)
    return new Block(data || Buffer.alloc(0), cid)
  }
}

module.exports = MemStore
