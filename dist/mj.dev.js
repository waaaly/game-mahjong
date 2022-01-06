"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getJokers() {
  var jokers = {
    "tong": [{
      id: "MJ_TONG_1",
      joker: 1,
      type: 1,
      img: "tong_1"
    }, {
      id: "MJ_TONG_2",
      joker: 2,
      type: 1,
      img: "tong_2"
    }, {
      id: "MJ_TONG_3",
      joker: 3,
      type: 1,
      img: "tong_3"
    }, {
      id: "MJ_TONG_4",
      joker: 4,
      type: 1,
      img: "tong_4"
    }, {
      id: "MJ_TONG_5",
      joker: 5,
      type: 1,
      img: "tong_5"
    }, {
      id: "MJ_TONG_6",
      joker: 6,
      type: 1,
      img: "tong_6"
    }, {
      id: "MJ_TONG_7",
      joker: 7,
      type: 1,
      img: "tong_7"
    }, {
      id: "MJ_TONG_8",
      joker: 8,
      type: 1,
      img: "tong_8"
    }, {
      id: "MJ_TONG_9",
      joker: 9,
      type: 1,
      img: "tong_9"
    }],
    "suo": [{
      id: "MJ_SUO_1",
      joker: 1,
      type: 2,
      img: "suo_1"
    }, {
      id: "MJ_SUO_2",
      joker: 2,
      type: 2,
      img: "suo_2"
    }, {
      id: "MJ_SUO_3",
      joker: 3,
      type: 2,
      img: "suo_3"
    }, {
      id: "MJ_SUO_4",
      joker: 4,
      type: 2,
      img: "suo_4"
    }, {
      id: "MJ_SUO_5",
      joker: 5,
      type: 2,
      img: "suo_5"
    }, {
      id: "MJ_SUO_6",
      joker: 6,
      type: 2,
      img: "suo_6"
    }, {
      id: "MJ_SUO_7",
      joker: 7,
      type: 2,
      img: "suo_7"
    }, {
      id: "MJ_SUO_8",
      joker: 8,
      type: 2,
      img: "suo_8"
    }, {
      id: "MJ_SUO_9",
      joker: 9,
      type: 2,
      img: "suo_9"
    }],
    "wan": [{
      id: "MJ_WAN_1",
      joker: 1,
      type: 3,
      img: "wang_1"
    }, {
      id: "MJ_WAN_2",
      joker: 2,
      type: 3,
      img: "wang_2"
    }, {
      id: "MJ_WAN_3",
      joker: 3,
      type: 3,
      img: "wang_3"
    }, {
      id: "MJ_WAN_4",
      joker: 4,
      type: 3,
      img: "wang_4"
    }, {
      id: "MJ_WAN_5",
      joker: 5,
      type: 3,
      img: "wang_5"
    }, {
      id: "MJ_WAN_6",
      joker: 6,
      type: 3,
      img: "wang_6"
    }, {
      id: "MJ_WAN_7",
      joker: 7,
      type: 3,
      img: "wang_7"
    }, {
      id: "MJ_WAN_8",
      joker: 8,
      type: 3,
      img: "wang_8"
    }, {
      id: "MJ_WAN_9",
      joker: 9,
      type: 3,
      img: "wang_9"
    }],
    "fan": [{
      id: "MJ_FAN_1",
      joker: 1,
      type: 4,
      img: "fan_1"
    }, {
      id: "MJ_FAN_2",
      joker: 2,
      type: 4,
      img: "fan_2"
    }, {
      id: "MJ_FAN_3",
      joker: 3,
      type: 4,
      img: "fan_3"
    }, {
      id: "MJ_FAN_4",
      joker: 4,
      type: 4,
      img: "fan_4"
    }, {
      id: "MJ_FAN_5",
      joker: 5,
      type: 4,
      img: "fan_5"
    }, {
      id: "MJ_FAN_6",
      joker: 6,
      type: 4,
      img: "fan_6"
    }, {
      id: "MJ_FAN_7",
      joker: 7,
      type: 4,
      img: "fan_7"
    }]
  };
  var allJoker = [];
  var offset = 0;
  Object.keys(jokers).forEach(function (item, index) {
    jokers[item].map(function (jo, joi) {
      allJoker.push(_objectSpread({}, jo, {
        key: offset + 4 * joi + 1
      }));
      allJoker.push(_objectSpread({}, jo, {
        key: offset + 4 * joi + 2
      }));
      allJoker.push(_objectSpread({}, jo, {
        key: offset + 4 * joi + 3
      }));
      allJoker.push(_objectSpread({}, jo, {
        key: offset + 4 * joi + 4
      }));
    });
    offset += 36;
  });
  return allJoker;
}

module.exports = getJokers();