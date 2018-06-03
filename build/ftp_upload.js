var FtpDeploy = require('./ftp-deploy');
var ftpDeploy = new FtpDeploy(),
    localDir = './../dist';

var config = {
    user: process.env.FTP_USER,                   // NOTE that this was username in 1.x 
    password: process.env.FTP_PASS,           // optional, prompted if none given
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: __dirname + localDir,
    remoteRoot: '/public_html/onlyjonathan.com',//process.env.FTP_PATH, 
    include: ['*', '**/*'],      // this would upload everything except dot files
    exclude: [],
    deleteRemote: false                // delete existing files at destination before uploading
}
console.log("Uploading files from "+ localDir +" to "+process.env.FTP_HOST+process.env.FTP_PATH)
// use with promises
ftpDeploy.deploy(config)
    .then(res => console.log('Finished file upload.'))
    .catch(err => console.log(err))
ftpDeploy.on('uploading', function(data) {
     console.log('Starting upload of '+data.filename)
});
ftpDeploy.on('uploaded', function(data) {
    console.log('Finished uploading '+data.filename)
});
ftpDeploy.on('upload-error', function (data) {
	console.log(data.err); // data will also include filename, relativePath, and other goodies
});