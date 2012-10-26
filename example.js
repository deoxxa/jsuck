#!/usr/bin/env node

var JSuck = require("./index");

var jsuck = new JSuck();

jsuck.on("data", function(e) {
  console.log(e);
});

jsuck.on("error", function(e) {
  console.log(e);
});

jsuck.write('{"a":"b","c":"d"}\n{"a":"b","c":"d"}');
