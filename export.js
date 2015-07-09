if (typeof Package !== 'undefined') {
	/*global componentHandler:true*/  // Meteor.js creates a file-scope global for exporting. This comment prevents a potential JSHint warning.
	componentHandler = this.componentHandler;
	delete this.componentHandler;
	
	// Add an alias. "Lite" is lowercase because I think it's not at the same level at "Material Design".
	/*global MDl:true*/
	MDl = {
		'componentHandler': componentHandler,
		// Attach EnvConfig for public access.
		'envConfig': EnvConfig
	};
}