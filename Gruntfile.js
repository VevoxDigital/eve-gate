'use strict';

module.exports = (grunt) => {
  grunt.initConfig({

  });

  // NOTE Tasks
  // Tests.
  grunt.registerTask('test-src', []);
  grunt.registerTask('test-dist', []);
  grunt.registerTask('test', ['test-src', 'test-dist']);

  // Building
  grunt.registerTask('build', [

  ]);
  grunt.registerTask('dist', ['build']);

  // Misc
  grunt.registerTask('clean', [

  ]);
  grunt.registerTask('serve', [

  ]);
};
