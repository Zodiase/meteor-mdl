if (typeof Package !== 'undefined') {
	/*global componentHandler:true*/  // Meteor.js creates a file-scope global for exporting. This comment prevents a potential JSHint warning.
	componentHandler = this.componentHandler;
	delete this.componentHandler;
	
	// Attach EnvConfig to componentHandler for public access.
	/*global EnvConfig:true*/
	componentHandler.envConfig = EnvConfig;
}