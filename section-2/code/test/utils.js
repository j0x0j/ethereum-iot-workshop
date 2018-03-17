function promisifyEventWatcher (events) {
  return new Promise((resolve, reject) => {
    events.watch((error, log) => {
      if (error) {
        reject(error)
      } else {
        resolve(log)
      }
    })
  })
}

module.exports = {
  promisifyEventWatcher
}
