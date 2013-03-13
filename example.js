#!/usr/bin/env node

var JSuck = require("./index");

var jsuck = new JSuck();

jsuck.on("error", function(e) {
  console.log(e);
});

jsuck.on("readable", function() {
  var o;

  while (o = jsuck.read()) {
    console.log(o);
  }
});

jsuck.write('{\n"a":"b",\n\n"c":   \t\r\r\n"d"}\n{"a":"b","c":"d"}');
jsuck.write('{\n"a":"b",\n\n"c":   \t\r\r\n"d"');
jsuck.write('}\n{"a":"b","c":"d"}');
