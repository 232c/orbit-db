
/**
 * @typedef { string | Buffer | ArrayBuffer | Uint8Array | Blob } Data
 * @param {IPFS} ipfs
 * @param {Data} data 
 * @param {boolean} pin 
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
 * @returns {Promise<Buffer>}
 */
const readFile = async (ipfs, cid, pin = true) => {
  const buf = await ipfs.cat(cid)
  if (pin) {
    await ipfs.pin.add(cid)
  }
  return buf
}

const readObj = async (ipfs, cid, pin = true) => {
  const buf = await readFile(ipfs, cid, pin)
  return JSON.parse(buf.toString('utf-8'))
}

module.exports = {
  readFile,
  writeFile,
  readObj,
  writeObj,
}
