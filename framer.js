'use strict';

var EventEmitter = require('events').EventEmitter;
var bcoin = require('bcoin');
var utils = bcoin.utils;
var crypto = bcoin.crypto;
var assert = utils.assert;
var constants = bcoin.constants;
var chachapoly = require('bcoin/lib/crypto/chachapoly');
var wire = require('./wire');

/**
 * Protocol packet framer
 * @exports Framer
 * @constructor
 * @param {Object} options
 */

function Framer(options) {
  if (!(this instanceof Framer))
    return new Framer(options);

  if (!options)
    options = {};

  this.options = options;

  this.network = bcoin.network.get(options.network);
}

/**
 * Frame a payload with a header.
 * @param {String} cmd - Packet type.
 * @param {Buffer} payload
 * @returns {Buffer} Payload with header prepended.
 */

Framer.prototype.packet = function packet(cmd, payload) {
  var i, packet;

  assert(payload, 'No payload.');

  packet = new Buffer(12 + payload.length);
  packet.writeUInt32BE(this.network.magic, 0, true);
  packet.writeUInt32BE(cmd, 4, true);
  packet.writeUInt32BE(payload.length, 8, true);
  payload.copy(packet, 12);

  return packet;
};

module.exports = Framer;
