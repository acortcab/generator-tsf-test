'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
var path = require('path');
var fs = require('fs');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the stupendous ${chalk.red('generator-tsf-test')} generator!`)
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to use primeng?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.primeng = props.someAnswer;
    });
  }

  writing() {
	//this.fs.write("somefile.js", "var a = 1;");
	var projectName = path.basename(process.cwd());
	
	if(this.primeng){
	  
		var pathDep = "package.json";
		var jsonObjDep = this.fs.readJSON(pathDep);
		jsonObjDep.dependencies['primeng'] = '7.0.0' ;
		jsonObjDep.dependencies['primeicons'] = '^1.0.0' ;
		this.fs.writeJSON(pathDep, jsonObjDep);	
		
		var pathAng = "angular.json";
		var jsonObjAng = this.fs.readJSON(pathAng);
		
		var numberElements = jsonObjAng.projects[projectName].architect.build.options.styles.length;
		var stylesChanged = 'node_modules/primeng/resources/themes/nova-light/theme.css';
		var stylesChanged2 = 'node_modules/primeng/resources/primeng.min.css';
		var stylesChanged3 = 'node_modules/primeicons/primeicons.css';
		//var stylesEnd = styles + stylesChanged;
		jsonObjAng.projects[projectName].architect.build.options.styles[numberElements] = stylesChanged ;
		jsonObjAng.projects[projectName].architect.build.options.styles[numberElements + 1] = stylesChanged2 ;
		jsonObjAng.projects[projectName].architect.build.options.styles[numberElements + 2] = stylesChanged3 ;
		
		this.fs.writeJSON(pathAng , jsonObjAng);
	}
	
  }

  install() {
    this.installDependencies();
  }
};
