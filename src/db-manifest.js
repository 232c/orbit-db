const path = require('path')
const fileio = require('./fileio')

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

  return fileio.writeObj(ipfs, manifest, options)
}

module.exports = createDBManifest
