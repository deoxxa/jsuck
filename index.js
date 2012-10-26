var Steez = require("steez"),
    clarinet = require("clarinet"),
    util = require("util");

var JSuck = module.exports = function JSuck() {
  Steez.call(this);

  this.clarinet = clarinet.createStream();

  this.states = [];
  this.list = [];

  this.clarinet.on("error", this.emit.bind(this, "error"));

  this.clarinet.on("value", function(val) {
    if (this.states[this.states.length-1] === "array") {
      this.list[this.list.length-1].push(val);
    } else if (this.states[this.states.length-1] === "object") {
      this.list[this.list.length-1][this.key] = val;
      delete this.key;
    }
  }.bind(this));

  this.clarinet.on("key", function(key) {
    if (this.states[this.states.length-1] === "object") {
      this.key = key;
    }
  }.bind(this));

  this.clarinet.on("openobject", function(key) {
    var val = {};

    if (this.states[this.states.length-1] === "array") {
      this.list[this.list.length-1].push(val);
    } else if (this.states[this.states.length-1] === "object") {
      this.list[this.list.length-1][this.key] = val;
      delete this.key;
    }

    this.list.push(val);
    this.states.push("object");

    if (key) {
      this.key = key;
    }
  }.bind(this));

  this.clarinet.on("closeobject", function() {
    var o = this.list.pop();
    this.states.pop();

    if (this.list.length === 0) {
      this.emit("data", o);
    }
  }.bind(this));

  this.clarinet.on("openarray", function() {
    var val = [];

    if (this.states[this.states.length-1] === "array") {
      this.list[this.list.length-1].push(val);
    } else if (this.states[this.states.length-1] === "object") {
      this.list[this.list.length-1][this.key] = val;
      delete this.key;
    }

    this.list.push(val);
    this.states.push("array");
  }.bind(this));

  this.clarinet.on("closearray", function() {
    var o = this.list.pop();
    this.states.pop();

    if (this.list.length === 0) {
      this.emit("data", o);
    }
  }.bind(this));
};
util.inherits(JSuck, Steez);

JSuck.prototype.write = function write(data) {
  this.clarinet.write(data);

  return !this.paused && this.writable;
};
