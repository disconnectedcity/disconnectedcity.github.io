(() => {
  var isDevelopmentEnvironment = window.location.hostname === '127.0.0.1'
  if (isDevelopmentEnvironment) {
    document.write('<script src="http://127.0.0.1:35729/livereload.js?snipver=1"></script>')
  }
})()