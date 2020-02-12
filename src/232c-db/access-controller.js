
const AccessController = require('orbit-db-access-controllers/src/access-controller-interface')

/** @type {(entry, identityProvider) => boolean} */
const NOOP = function (entry, identityProvider) { return true }

class Celsius232AC extends AccessController {

    _callback = NOOP;

    constructor(callback) {
        super()
        this._callback = typeof callback === 'function' ? callback : NOOP
    }

    static get type() {
        return '232c'
    }

    static get version() {
        return '1.0.0'
    }

    async canAppend(entry, identityProvider) {
        try {
            return this._callback(entry, identityProvider)
        } catch (err) {
            console.error(err)
            return true
        }
    }

    async save() {
        // return parameters needed for loading
        return {
            version: Celsius232AC.version
        }
    }

    static async create(orbitdb, acOptions = {}) {
        const { callback } = Object.assign({ callback: NOOP }, acOptions)
        return new Celsius232AC(callback)
    }

}

module.exports = Celsius232AC
