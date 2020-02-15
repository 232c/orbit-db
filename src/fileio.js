
/**
 * @param {IPFS} ipfs
 * @param { string | Buffer | ArrayBuffer | Uint8Array | Blob } data 
 * @param {boolean=} pin 
 * @returns {Promise<string>} hash
 */
const writeFile = async (ipfs, data, pin = true) => {
  const f = await ipfs.add(data, {
    pin,
  })
  const res = f[0].hash
  return res
}

/**
 * @param {IPFS} ipfs
 * @param {object} obj 
 * @param {{ pin?: boolean; }=} options 
 * @returns {Promise<string>} hash
 */
const writeObj = async (ipfs, obj, options) => {
  const data = Buffer.from(JSON.stringify(obj))
  const pin = options && options.pin
  const hash = await writeFile(ipfs, data, pin)
  return hash
}

/**
 * @param {IPFS} ipfs 
 * @param {string} cid 
 * @returns {Promise}
 */
const pinCid = (ipfs, cid) => {
  return ipfs.pin.add(cid, {
    timeout: '5s'
  })
}

/**
 * @param {IPFS} ipfs 
 * @param {string} cid 
 * @param {boolean=} pin 
 * @returns {Promise<Buffer>}
 */
const readFile = async (ipfs, cid, pin = true) => {
  const buf = await ipfs.cat(cid)
  if (pin) {
    pinCid(ipfs, cid)
  }
  return buf
}

/**
 * @param {IPFS} ipfs 
 * @param {string} cid 
 * @param {boolean=} pin 
 */
const readObj = async (ipfs, cid, pin = true) => {
  const buf = await readFile(ipfs, cid, pin)
  return JSON.parse(buf.toString('utf-8'))
}

module.exports = {
  readFile,
  writeFile,
  readObj,
  writeObj,
  pinCid,
}
