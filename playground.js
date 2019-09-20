const testFolder = '/Users/Cyang/Desktop';
const fs = require('fs');

function exists(filepath){  
  return fs.existsSync(filepath) || path.existsSync(filepath);  
}  

function isFile(filepath){  
  return exists(filepath) && fs.statSync(filepath).isFile();  
}  

// fs.readdir(testFolder, (err, files) => {
//   if(err) console.log(err);
//   console.log(files.filter(x => !isFile(testFolder + '/' + x)))
// })

// const readdir = function(path) {
//   return new Promise(function(resolve, reject) {
//     fs.readdir(path, function(err, files) {
//       if(err) return reject(err)
//       resolve(files);
//     })
//   })
// }

// const tmp = async function() {
//   const files = await readdir(testFolder)
//   console.log(files.map(x => testFolder + '/' + x));
// }

// tmp();

console.log(fs.readdirSync(testFolder))