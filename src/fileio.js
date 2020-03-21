
/**
 * @param {IPFS} ipfs
 * @param { string | Buffer | ArrayBuffer | Uint8Array | Blob } data 
 * @param {boolean=} pin 
 * @param {boolean=} onlyHash 
 * @returns {Promise<string>} hash
 */
const writeFile = async (ipfs, data, pin = true, onlyHash = false) => {
  const l = ipfs.add(data, {
    /** @default true */
    pin,
    /** @default false */
    onlyHash,
  })
  for await (let f of l) {
    const hash = f.cid.toString()
    return hash
  }
}

/**
 * @param {IPFS} ipfs
 * @param {object} obj 
 * @param {{ pin?: boolean; onlyHash?: boolean; }=} options 
 * @returns {Promise<string>} hash
 */
const writeObj = async (ipfs, obj, options = {}) => {
  const data = Buffer.from(JSON.stringify(obj))
  const hash = await writeFile(ipfs, data, options.pin, options.onlyHash)
  return hash
}

/**
 * @param {IPFS} ipfs 
 * @param {string} cid 
 * @returns {Promise<Array<{ cid: import("cids"); }>>}
 */
const pinCid = async (ipfs, cid) => {
  return ipfs.pin.add(cid, {
    // timeout: '5s'
  })
}

/**
 * @param {IPFS} ipfs 
 * @param {string} cid 
 * @param {boolean=} pin 
 * @returns {Promise<Buffer>}
 */
const readFile = async (ipfs, cid, pin = true) => {
  const chunks = []
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk)
  }

  const buf = Buffer.concat(chunks)

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
