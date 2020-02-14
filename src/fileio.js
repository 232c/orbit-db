
const writeObj = async (ipfs, obj, options) => {
  const data = Buffer.from(JSON.stringify(obj))

  const f = await ipfs.add(data, {
    pin: options.pin || false,
  })

  const res = f[0].hash

  return res
}

const readObj = async (ipfs, cid) => {
  const buf = await ipfs.cat(cid)
  await ipfs.pin.add(cid)
  return JSON.parse(buf.toString('utf-8'))
}

module.exports = {
  read: readObj,
  write: writeObj
}
