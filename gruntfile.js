const grunt = require('grunt');

grunt.config.init({
  pkg: grunt.file.readJSON('package.json'),
  'create-windows-installer': {
    x64: {
      appDirectory: './hakon/hakon-win32-x64/',
      outputDirectory: './release/',
      authors: 'maxuekai',
      exe: 'hakon.exe',
      loadingGif: './loading.gif',
      noMsi: true
    },
    ia32: {
      appDirectory: './hakon/hakon-win32-ia32/',
      outputDirectory: './release/',
      authors: 'maxuekai',
      exe: 'hakon.exe',
      loadingGif: './loading.gif',
      noMsi: true
    }
  }
});

grunt.loadNpmTasks('grunt-electron-installer');

grunt.registerTask('default', ['create-windows-installer']);