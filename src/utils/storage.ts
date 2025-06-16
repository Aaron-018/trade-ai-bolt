function getStorageType(type = 'local') {
  return type === 'local' ? localStorage : sessionStorage
}

type StorageType = 'session' | 'local';

class Storage {
  get(key: string, type: StorageType = 'local') {
    let result = null
    const storage = getStorageType(type)
    result = storage.getItem(key)
    if (result) {
      try {
        const res = JSON.parse(result)
        return typeof res !== 'object' ? result : res
      } catch (e) {
        return result
      }
    }
    return null
  }
  set(key: string, value: any, type: StorageType = 'local') {
    const storage = getStorageType(type)
    const _value = typeof value === 'string' ? value : JSON.stringify(value)
    storage.setItem(key, _value)
  }
  remove(key: string, type: StorageType = 'local') {
    const storage = getStorageType(type)
    storage.removeItem(key)
  }
  clear(type: StorageType = 'local') {
    const storage = getStorageType(type)
    storage.clear()
  }
}

export default new Storage()
