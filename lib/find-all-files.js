const fs = require('fs')

const findAllFiles = (dir, _files_) => {
  const files_ = _files_ || [];
  const files = fs.readdirSync(dir)
  for (var i in files) {
    const name = dir + '/' + files[i]
    if (fs.statSync(name).isDirectory()) {
      findAllFiles(name, files_)
    } else {
      files_.push(name.match(/[^\/]+$/gi)[0])
    }
  }
  return files_
}

module.exports = findAllFiles
