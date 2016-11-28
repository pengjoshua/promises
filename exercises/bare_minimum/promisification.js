/**
 * Create the promise returning `Async` suffixed versions of the functions below,
 * Promisify them if you can, otherwise roll your own promise returning function
 */ 

var fs = require('fs');
var request = require('request');
var crypto = require('crypto');
var Promise = require('bluebird');
// var fs = Promise.promisifyAll(require('fs'));
// var request = Promise.promisify(require('request'));

// (1) Asyncronous HTTP request
var getGitHubProfile = function(user, callback) {
  var options = {
    url: 'https://api.github.com/users/' + user,
    headers: { 'User-Agent': 'request' },
    json: true  // will JSON.parse(body) for us
  };

  request.get(options, function(err, res, body) {
    if (err) {
      callback(err, null);
    } else if (body.message) {
      callback(new Error('Failed to get GitHub profile: ' + body.message), null);
    } else {
      callback(null, body);
    }
  });
};

var getGitHubProfileAsync = (user) => {
  var options = {
    url: 'https://api.github.com/users/' + user,
    headers: { 'User-Agent': 'request' },
    json: true  // will JSON.parse(body) for us
  };

  return new Promise((fulfill, reject) => {
    request.get(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (body.message) {
        reject(new Error('Failed to get GitHub profile: ' + body.message), null);
      } else {
        fulfill(body);
      }
    });
  });
}; 

// var getGitHubProfileAsync = Promise.promisify(getGitHubProfile);

// (2) Asyncronous token generation
var generateRandomToken = function(callback) {
  crypto.randomBytes(20, function(err, buffer) {
    if (err) { return callback(err, null); }
    callback(null, buffer.toString('hex'));
  });
};

var generateRandomTokenAsync = () => {
  return new Promise((fulfill, reject) => {
    crypto.randomBytes(20, (err, buffer) => {
      if (err) { reject(err); }
      fulfill(buffer.toString('hex'));
    });
  });
};

// var generateRandomTokenAsync = Promise.promisify(generateRandomToken);

// (3) Asyncronous file manipulation
var readFileAndMakeItFunny = function(filePath, callback) {
  fs.readFile(filePath, 'utf8', function(err, file) {
    if (err) { return callback(err); }
   
    var funnyFile = file.split('\n')
      .map(function(line) {
        return line + ' lol';
      })
      .join('\n');

    callback(funnyFile);
  });
};

var readFileAndMakeItFunnyAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, file) => {
      if (err) { return reject(err); }
      
      var funnyFile = file.split('\n')
        .map((line) => {
          return line + ' lol';
        });

      resolve(funnyFile);
    });
  });
};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getGitHubProfileAsync: getGitHubProfileAsync,
  generateRandomTokenAsync: generateRandomTokenAsync,
  readFileAndMakeItFunnyAsync: readFileAndMakeItFunnyAsync
};
