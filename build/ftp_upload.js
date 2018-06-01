var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy(),
    localDir = './../dist';

var config = {
    user: process.env.FTP_USER,                   // NOTE that this was username in 1.x 
    password: process.env.FTP_PASS,           // optional, prompted if none given
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + localDir,
    remoteRoot: process.env.FTP_PATH, // /home2/jonath25/public_html/onlyjonathan.com/
    include: ['*', '**/*'],      // this would upload everything except dot files
    exclude: ['dist/**/*.map'],     // e.g. exclude sourcemaps
    deleteRoot: false                // delete existing files at destination before uploading
}
console.log("Uploading files from "+ localDir +" to "+FTP_HOST+FTP_PATH)
// use with promises
ftpDeploy.deploy(config)
    .then(res => console.log('Finished file upload.'))
    .catch(err => console.log(err))
ftpDeploy.on('uploading', function(data) {
  data.totalFileCount;       // total file count being transferred
  data.transferredFileCount; // number of files transferred
  data.filename;             // partial path with filename being uploaded
});
ftpDeploy.on('uploaded', function(data) {
	console.log(data);         // same data as uploading event
});
ftpDeploy.on('upload-error', function (data) {
	console.log(data.err); // data will also include filename, relativePath, and other goodies
});