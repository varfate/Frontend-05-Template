var Generator = require('yeoman-generator');

module.exports = class extends (
  Generator
) {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async initPackage() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: 'demo-vue',
      },
    ]);

    this.answers = answers;

    const pkgJson = {
      name: answers.name,
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        build: 'webpack',
      },
      author: '',
      license: 'ISC',

      devDependencies: {},
      dependencies: {},
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.yarnInstall(['vue']);
    this.yarnInstall(
      [
        'webpack',
        'webpack-cli',
        'html-webpack-plugin',
        'vue-loader',
        'css-loader',
        'vue-style-loader',
        'vue-template-compiler',
      ],
      { dev: true }
    );
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('app.vue'),
      this.destinationPath('src/app.vue')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: this.answers.name }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
  }
};
