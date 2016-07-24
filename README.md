<p align="center">
  <img src="https://cdn.rawgit.com/VevoxDigital/tech-3/master/banner.png">
</p>

<p align="center"><strong>
  A collection of premier tools for <a href="http://eveonline.com">EVE Online</a>
</strong></p>

<div align="center">
  <a href="https://travis-ci.org/VevoxDigital/tech-3">
    <img src="https://img.shields.io/travis/VevoxDigital/tech-3.svg?style=flat-square" alt="Build Status">
  </a>
  <a href="https://codeclimate.com/github/VevoxDigital/tech-3/coverage">
    <img src="https://img.shields.io/codeclimate/coverage/github/VevoxDigital/tech-3.svg?style=flat-square" alt="Coverage">
  </a>
  <a href="https://codeclimate.com/github/VevoxDigital/tech-3">
    <img src="https://img.shields.io/codeclimate/github/VevoxDigital/tech-3.svg?style=flat-square" alt="Code GPA">
  </a>
  <a href="https://github.com/VevoxDigital/tech-3/issues">
    <img src="https://img.shields.io/github/issues/VevoxDigital/tech-3.svg?style=flat-square" alt="Open Issues">
  </a>
  <a href="https://codeclimate.com/github/VevoxDigital/tech-3">
    <img src="https://img.shields.io/codeclimate/issues/github/VevoxDigital/tech-3.svg?style=flat-square" alt="Code Issues">
  </a>
</div>

<p align="center">
  <img src="https://img.shields.io/github/release/VevoxDigital/tech-3.svg?style=flat-square" alt="Release">
  <img src="https://img.shields.io/badge/node-4.0-blue.svg?style=flat-square" alt="Node Version">
  <a href="https://github.com/VevoxDigital/tech-3/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/VevoxDigital/tech-3.svg?style=flat-square" alt="LICENSE">
  </a>
</p>

<p align="center">
  <a href="#fork-destination-box">
    <img src="https://img.shields.io/github/forks/VevoxDigital/tech-3.svg?style=social&label=Fork" alt="Fork">
  </a>
  <a href="https://twitter.com/VevoxDigital">
    <img src="https://img.shields.io/twitter/follow/VevoxDigital.svg?style=social&label=Follow" alt="Follow">
  </a>
</p>

## Contributing
Open-source projects are specifically designed to be community driven, giving us an opportunity to not only create a series tools that are exactly what the community wants without any malicious content. Nothing to hide, everything to show for.

While we are happy to take community contributions to Tech 3, there are a few guidelines we ask you follow, however.
- Maintain the current code style of Tech 3. CodeClimate should give you an A and it should fit in with existing code.
- CodeClimate should not raise any issues other than TODOs.
- The build through Travis must pass and tests should cover 100%.
- Be aware that all code you submit to Tech-3 belongs to Tech 3 (and is therefore under Tech 3's open-source license) after the request is merged.

## Local Installation
Tech 3 can be installed in a local environment if you really don't want to pay for it (although please consider supporting us with donations), assuming you have the machinery to host it yourself. Note that not all portions of Tech 3 (such as the market graphs) will work as intended if installed locally. You can also clone the dev branch to test new features coming soon to Tech 3 or help us improve Tech 3 itself.

To install, you will need **NodeJS v4.0** (the `nodejs` package will *not* work) or later, Ruby Development Kit v2.0 or later (The `ruby-dev` package is fine), MongoDB, and Redis. Once you have all of these, proceed with the setup process:

    git clone https://github.com/VevoxDigital/tech-3/
    npm install -g grunt-cli bower yo generator-angular
    gem install compass
    cd tech-3
    npm install && bower install
    touch .secret && echo "change-me-to-random-string" | tee .secret

This should initialize the environment. The MongoDB and Redis database will set themselves up once the server is run for the first time. Verify the installation is working and start the client environment:

    grunt test
    grunt serve

This creates a test web server with live reload on port `9000`. This is *only* the front-end and expect the back-end api to be running on port `80` on the same hostname.

Download the lastest SDE from the [Developer Resources Page](https://developers.eveonline.com/resource/resources) and extract the `sde` directory to the root directory of `tech-3`. Run the importers to import the necessary data (this takes a while, but only needs to be done once) and run the server.

    node importer.js --all
    node index.js

Note that NodeJS may raise a `EADDRINUSE` if `apache2` or `nginx` is running and/or (simply stop the service) may raise a `EACCESS` if it has insufficient permissions to bind to port `80` (try running with `sudo`). You can use the `--port=0000` option to change the port on server start, but `/app/scripts/services/backend-service.js` will need to be updated accordingly.

## Legal
All code, content, and other media created or otherwise owned by Tech-3 is licensed under the GNU General Public License v3.0, found [here](https://github.com/VevoxDigital/tech-3/blob/master/LICENSE).

EVE Online and associated media are registered trademarks of CCP hf and use was permitted by CCP hf for developer use in third-party applications. Tech-3 is in no way affiliated with CCP hf.
