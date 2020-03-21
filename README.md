# @232c/OrbitDB

> Modified version of OrbitDB for [232°C](Modified version of OrbitDB for 232°C)

Significant changes from the [original version of orbit-db](https://github.com/orbitdb/orbit-db):

* support for js-ipfs v0.41 (merged from [orbitdb/orbit-db#767](https://github.com/orbitdb/orbit-db/pull/767))
* save the db manifest file using [ipfs.add](https://github.com/ipfs/js-ipfs/blob/master/packages/interface-ipfs-core/SPEC/FILES.md#add) (dag-pb + UnixFS),  
  in order to be accessible by public IPFS HTTP gateways
