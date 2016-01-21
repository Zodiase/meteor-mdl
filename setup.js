// This file prepares variables for the rest of the package.
if (typeof Package !== 'undefined') {
  // Add an alias. "Lite" is lowercase because I think it's not at the same level at "Material Design".
  /*global MDl:true*/
  MDl = {
    "envConfig": {
      // Space for patchers to add their stuff. All patchers can assume the existence of this place.
      "patchers": {}
    }
  };
}
