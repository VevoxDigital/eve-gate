# Tech-3
[![Build Status](https://travis-ci.org/VevoxDigital/tech-3.svg?branch=dev)](https://travis-ci.org/VevoxDigital/tech-3)
[![Test Coverage](https://codeclimate.com/github/VevoxDigital/tech-3/badges/coverage.svg)](https://codeclimate.com/github/VevoxDigital/tech-3/coverage)
[![Code Climate](https://codeclimate.com/github/VevoxDigital/tech-3/badges/gpa.svg)](https://codeclimate.com/github/VevoxDigital/tech-3)
[![Issue Count](https://codeclimate.com/github/VevoxDigital/tech-3/badges/issue_count.svg)](https://codeclimate.com/github/VevoxDigital/tech-3)

A collection of premier tools for CCP Games' [Eve Online](http://eveonline.com).

## Contributing
Open-source projects are specifically designed to be community driven, giving us an opportunity to not only create a series tools that are exactly what the community wants without any malicious content. Nothing to hide, everything to show for.

While we are happy to take community contributions to Tech-3, there are a few guidelines we ask you follow, however.
- Maintain the current code style of Tech-3. CodeClimate should give you an A and it should fit in with existing close.
- CodeClimate should not raise any issues other than TODOs.
- The build through Travis must pass and tests should cover 100%.
- Be aware that all code you submit to Tech-3 belongs to Tech-3 (and is therefore under Tech-3's open-source license) after the request is merged.

## Local Installation
Tech 3 can be installed in a local environment if you really don't want to pay for it (although please consider supporting us with donations), assuming you have the machinery to host it yourself. Note that not all portions of Tech-3 (such as the market graphs) will work as intended if installed locally. You can also clone the dev branch to test new features coming soon to Tech-3.

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

Note that NodeJS may raise a `EADDRINUSE` if `apache2` or `nginx` is running and/or may raise a `EACCESS` if it has insufficient permissions to bind to port `80`. You can use the `--port=0000` option to change the port on server start, but `/app/scripts/services/backend-service.js` will need to be updated accordingly.

## Legal
All code, content, and other media created or otherwise owned by Tech-3 is licensed under the GNU General Public License v3.0, found [here](https://github.com/VevoxDigital/tech-3/blob/master/LICENSE).

EVE Online and associated media are registered trademarks of CCP hf and use was permitted by CCP hf for developer use in third-party applications. Tech-3 is in no way affiliated with CCP hf.
