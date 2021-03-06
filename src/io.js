
const CID = require("cids")
const orbitdbio = require("orbit-db-io")
const UnixFS = require("ipfs-unixfs")

/**
 * @param {IPFS} ipfs
 * @param {Buffer} data 
 * @param {boolean=} pin 
 * @param {boolean=} onlyHash 
 * @returns {Promise<string>} hash
 */
const writeFile = async (ipfs, data, pin = true, onlyHash = false) => {
  const l = await ipfs.add(data, {
    /** @default true */
    pin,
    /** @default false */
    onlyHash,
  })

  if (!Array.isArray(l)) { // work in both js-ipfs 0.40 and > 0.40
    for await (let f of l) {
      const hash = f.cid.toString()
      return hash
    }
  } else {
    return l[0].hash
  }
}

/**
 * @param {IPFS} ipfs
 * @param {string} codec 
 * @param {object} obj 
 * @param {{ pin?: boolean; onlyHash?: boolean; }=} options 
 * @returns {Promise<string>} hash
 */
const write = async (ipfs, codec, obj, options = {}) => {
  if (codec !== "file") {
    return orbitdbio.write(ipfs, codec, obj, options)
  }

  const data = Buffer.from(JSON.stringify(obj))
  const hash = await writeFile(ipfs, data, options.pin, options.onlyHash)
  return hash
}

/**
 * @param {IPFS} ipfs 
 * @param {string | CID} cid 
 */
const read = async (ipfs, cid) => {
  cid = new CID(cid)

  if (cid.codec !== "dag-pb") {
    return orbitdbio.read(ipfs, cid)
  }

  const { value: node } = await ipfs.dag.get(cid)
  let data = node.toJSON().data

  try {
    return JSON.parse(Buffer.from(data))
  } catch (_) { }

  // io.write(ipfs, "file", obj, options)
  const f = UnixFS.unmarshal(data)
  if (f.type !== 'file') {
    throw new TypeError()
  }

  return JSON.parse(f.data)
}

module.exports = {
  read,
  write,
}
