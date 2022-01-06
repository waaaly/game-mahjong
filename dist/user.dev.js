"use strict";

function User() {
  this.data = [];
  this.size = 0;
}

User.prototype.add = function (data) {
  var set = new Set(this.data);
  set.add(data);
  this.data = Array.from(set);
  this.size = this.data.length;
};

User.prototype["delete"] = function (data) {
  var set = new Set(this.data);
  set["delete"](data);
  this.data = Array.from(set);
  this.size = this.data.length;
};

User.prototype.has = function (data) {
  return this.data.has(data);
};

User.prototype.length = function () {
  return this.size;
};

module.exports = new User();