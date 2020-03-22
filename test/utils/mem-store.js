'use strict'

const multihashing = require('multihashing-async')
const CID = require('cids')

const cidifyString = (str) => {
  if (!str) {
    return str
  }

  if (Array.isArray(str)) {
    return str.map(cidifyString)
  }

  return new CID(str)
}

/* Memory store using an LRU cache */
class MemStore {
  constructor () {
    this._store = new Map()
  }

  async put (value) {
    const buffer = Buffer.from(JSON.stringify(value))
    const multihash = await multihashing(buffer, 'sha2-256')
    const cid = new CID(1, 'dag-cbor', multihash)
    const key = cid.toBaseEncodedString('base58btc')
    this._store.set(key, value)

    return cid
  }

  async get (cid, ipfs) {
    if (CID.isCID(cid)) {
      cid = cid.toBaseEncodedString('base58btc')
    }

    let data = this._store.get(cid)
    if (!data) {
      // io.write(ipfs, 'file', obj, options) puts the object as a file using `ipfs.add`
      // can't call into the `ipfs.dag.add` API and put data into the MemStore
      // so read data from IPFS using `ipfs.cat` instead
      const chunks = []
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk)
      }
      data = Buffer.concat(chunks)
    }

    const links = ['next', 'heads']
    links.forEach((prop) => {
      if(data[prop])
        data[prop] = cidifyString(data[prop])
    })

    return {
      value: data
    }
  }
}

module.exports = MemStore
