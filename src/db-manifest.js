const path = require('path')
const io = require('./io')

// Creates a DB manifest file and saves it in IPFS
const createDBManifest = async (ipfs, name, type, accessControllerAddress, options) => {
  const manifest = Object.assign({
    name: name,
    type: type,
    accessController: (path.posix || path).join('/ipfs', accessControllerAddress)
  },
  // meta field is only added to manifest if options.meta is defined
  // 232c logstore requires the meta field
  options.meta !== undefined ? { meta: options.meta } : {}
  )

  return io.write(ipfs, options.format || 'file', manifest, options)
}

// read the DB manifest file from IPFS
const readDBManifest = async (ipfs, dbManifestCid) => {
  return io.read(ipfs, dbManifestCid)
}

module.exports = {
  createDBManifest,
  readDBManifest,
}
