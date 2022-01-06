"use strict";

function ClientSocket(cs) {
  this._socket = cs;
}

ClientSocket.prototype.shuffle = function () {};

module.exports = ClientSocket;