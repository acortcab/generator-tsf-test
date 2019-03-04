'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
var fs = require('fs');
const path = require("path");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the swell ${chalk.red('generator-tsf-test')} generator!`)
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to install log backend lib?',
        default: true
			},
			{
        type: 'confirm',
        name: 'primeng',
        message: 'Would you like to install primeng lib?',
        default: true
			}
			
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer and primeng;
			this.logLib = props.someAnswer;
			this.primeng = props.primeng;
    });
  }

  writing() {

		if(this.primeng){

			var projectName = path.basename(process.cwd());
			
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
		
		
	if(this.logLib){


		var filePath = "src/app/app.module.ts";

		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(filePath)
		});

		/** Variables:  Add Imports*/
		var newValue = '';
		var lastImport = '';
		var newImport = "\r\nimport { HttpClient,HttpHandler, HttpClientModule } from '@angular/common/http';"; // value to change
		var newImport2 = "\r\nimport { LogService,LogPublishersService } from 'tsf-log-library';"; // value to change
    

		/** Variables: Add Info in NgModules in Imports */
		var ngModuleRead = false;
		var ngModuleOld = '';
		var ngModuleOld2 = '';
		var ngModuleNew = 'HttpClientModule';	// value to change

		/** Variables: Add Info in NgModules in providers */
		var ngModuleReadProviders = false;
		var ngModuleOldProviders = '';
		var ngModuleOldProviders2 = '';
		var ngModuleNewProviders = 'LogService';	// value to change
		var ngModuleNewProviders2 = 'LogPublishersService';	// value to change
	  
	  // read file each line 
		lineReader.on('line', function (line) {

			/** Add Imports */
		 if(line.startsWith('import')){
		   lastImport = line;
		   //console.log('Line from file:', line);
		 }
		 if(line.startsWith('@NgModule(')){
		   newImport = lastImport  +newImport + newImport2;
		 }
     /** End Add Imports */



		 /**  Logic to add info in NgModules in Imports */
		if(ngModuleRead){
		  if(line.startsWith('  ],')){
			ngModuleRead = false;
			ngModuleNew = ngModuleOld.replace(ngModuleOld2, ngModuleNew);
			ngModuleNew = ngModuleOld+ "," + "\r\n" + ngModuleNew;
		  }else{
			ngModuleOld = line;
			ngModuleOld2 = line.trim(); 

			;
		  }
		}
	  
		if(line.startsWith('  imports: [')){
		  ngModuleRead = true;
		}
    /** END  Logic to add info in NgModules in Imports */


  /** Logic to add info in NgModules in providers */		 
		if(ngModuleReadProviders){
		  if(line.startsWith('  ],')){
        ngModuleReadProviders = false;
			  ngModuleNewProviders = ngModuleOldProviders.replace(ngModuleOldProviders2, ngModuleNewProviders);
			  ngModuleNewProviders = ngModuleOldProviders+ "," + "\r\n" + ngModuleNewProviders+ "," + "\r\n" + "\t"+ ngModuleNewProviders2;
		  }else{
			  ngModuleOldProviders = line;
			  ngModuleOldProviders2 = line.trim(); 
		  }
		}
		
		// if there is already providers added
		if(line.startsWith('  providers: [')){
		  ngModuleReadProviders = true;
		}
		// if there is NOT already providers added
		if(line.startsWith('  providers: [],')){
			ngModuleReadProviders = false;
			ngModuleOldProviders = line;
			ngModuleNewProviders = '  providers: [' + "\r\n" + "\t" +ngModuleNewProviders+ "," + "\r\n" + "\t"+ngModuleNewProviders2 + "\r\n"  + '  ],';
		}

		/**END Logic to add info in NgModules in providers */
		});
	   
		// add new values into the file
		fs.readFile(filePath, 'utf-8', function(err, data){
		if (err) throw err;

		var newValue = data.replace(lastImport, newImport);  // new imports
		newValue = newValue.replace(ngModuleOld, ngModuleNew); // new value imports in ngmodules
		newValue = newValue.replace(ngModuleOldProviders, ngModuleNewProviders); // new value providers in ngmodules


		 fs.writeFile(filePath, newValue, 'utf-8', function (err) {
		   if (err) throw err;
		   console.log('filelistAsync complete');
		 });
	   });

	   
	 }
  }
  
  installingLodash() {
		if(this.primeng){
			this.npmInstall(['primeng'], { 'save-dev': true });
			this.npmInstall(['primeicons'], { 'save-dev': true });
		}
		if(this.logLib){
			this.npmInstall(['tsf-log-library'], { 'save-dev': true });
		}
   }

  install() {
    this.installDependencies();
  }
};
