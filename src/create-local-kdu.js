// @flow

import Kdu from 'kdu'
import cloneDeep from 'lodash/cloneDeep'
import errorHandler from './lib/error-handler'

function createLocalKdu (): Component {
  const instance = Kdu.extend()

  // clone global APIs
  Object.keys(Kdu).forEach(key => {
    if (!instance.hasOwnProperty(key)) {
      const original = Kdu[key]
      instance[key] = typeof original === 'object'
        ? cloneDeep(original)
        : original
    }
  })

  // config is not enumerable
  instance.config = cloneDeep(Kdu.config)

  instance.config.errorHandler = errorHandler

  // option merge strategies need to be exposed by reference
  // so that merge strats registered by plguins can work properly
  instance.config.optionMergeStrategies = Kdu.config.optionMergeStrategies

  // make sure all extends are based on this instance.
  // this is important so that global components registered by plugins,
  // e.g. router-link are created using the correct base constructor
  instance.options._base = instance

  // compat for kdu-router < 2.7.1 where it does not allow multiple installs
  const use = instance.use
  instance.use = (plugin, ...rest) => {
    if (plugin.installed === true) {
      plugin.installed = false
    }
    if (plugin.install && plugin.install.installed === true) {
      plugin.install.installed = false
    }
    use.call(instance, plugin, ...rest)
  }
  return instance
}

export default createLocalKdu
