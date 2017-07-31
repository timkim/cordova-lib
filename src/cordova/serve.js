/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var cordova_util = require('./util'),
    crypto       = require('crypto'),
    path         = require('path'),
    shell        = require('shelljs'),
    url          = require('url'),
    platforms    = require('../platforms/platforms'),
    ConfigParser = require('cordova-common').ConfigParser,
    HooksRunner  = require('../hooks/HooksRunner'),
    Q            = require('q'),
    fs           = require('fs'),
    events       = require('cordova-common').events,
    serve        = require('cordova-serve');

var projectRoot;
var installedPlatforms;

module.exports = function server(port, opts) {
    return Q.promise(function(resolve) {
        projectRoot = cordova_util.cdProjectRoot();

        var hooksRunner = new HooksRunner(projectRoot);
        hooksRunner.fire('before_serve', opts).then(function () {
            // Run a prepare first!
            return require('./cordova').prepare([]);
        }).then(function () {
            var server = serve();

            server.launchServer();

            hooksRunner.fire('after_serve', opts).then(function () {
                resolve(server.server);
            });
        });
    });
};
