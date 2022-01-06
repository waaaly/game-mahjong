"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var e = require('cors');

var mjData = require('./mj');

var TONG = 1;
var SUO = 2;
var WAN = 3;
var FAN = 4;
/**
 * 乱序数组
 * @returns 
 */

function shuffle() {
  var arr = _toConsumableArray(mjData);

  for (var i = 0; i < arr.length - 1; i++) {
    var temp = arr[i];
    var rnd = i + Math.floor(Math.random() * (arr.length - i));
    arr[i] = arr[rnd];
    arr[rnd] = temp;
  }

  return arr;
}
/**
 * 将数组按照字面排序
 * @param {*} arr 
 * @returns 
 */


function sort(arr) {
  var wanArr = [],
      tongArr = [],
      suoArr = [],
      fanArr = [];
  arr.forEach(function (item) {
    if (item.type === TONG) {
      tongArr.push(item);
    } else if (item.type === SUO) {
      suoArr.push(item);
    } else if (item.type === WAN) {
      wanArr.push(item);
    } else {
      fanArr.push(item);
    }
  });
  wanArr.sort(function (a, b) {
    return a.joker - b.joker;
  });
  tongArr.sort(function (a, b) {
    return a.joker - b.joker;
  });
  suoArr.sort(function (a, b) {
    return a.joker - b.joker;
  });
  fanArr.sort(function (a, b) {
    return a.joker - b.joker;
  });
  return [].concat(tongArr, suoArr, wanArr, fanArr);
}
/**
 * 向有序数组插入保持有序
 * @param {*} arr
 * @param {*} card 
 */


function insert(arr, card) {
  var len = 0;

  while (len < arr.length) {
    if (card.joker >= arr[arr.length - 1].joker) {
      arr.push(card);
      break;
    }

    if (card.joker < arr[len].joker || card.joker == arr[len].joker) {
      arr.splice(len, 0, card);
      break;
    }

    len++;
  }

  return arr;
}
/**
 * 根据type 将数组分类为对象形式
 * @param {*} arr 
 * @returns 
 */


function groupByType(arr) {
  var arrType1 = [],
      arrType2 = [],
      arrType3 = [],
      arrType4 = [];
  arr.forEach(function (item) {
    if (item.type === 1) {
      arrType1.push(item);
    } else if (item.type === 2) {
      arrType2.push(item);
    } else if (item.type === 3) {
      arrType3.push(item);
    } else if (item.type === 4) {
      arrType4.push(item);
    }
  });
  return {
    '1': arrType1,
    '2': arrType2,
    '3': arrType3,
    '4': arrType4
  };
}
/**
 * 在指定数组返回key的下标
 * @param {*} arr 
 * @param {*} key 
 * @returns 
 */


function findCard(arr, key) {
  return arr.findIndex(function (item) {
    return item.key === key;
  });
}
/**
 * 判断指定卡是否在数组中
 * @param {*} arr 
 * @param {*} card 
 */


function isInclude(arr, card) {
  if (findCard(arr, card.key) === -1) {
    return false;
  } else {
    return true;
  }
}
/**
 * 判断三位数组是否连续有序
 * @param {*} arr 
 */


function isOrder(arr) {
  return arr[1].joker - arr[0].joker === 1 && arr[2].joker - arr[1].joker === 1;
}
/**
 * 吃
 */


function sequenceCard(cardGroup, card) {
  var type = card.type,
      cardArr = cardGroup[type];

  if (type === 4 || cardArr.length < 2) {
    return [];
  }

  cardArr = insert(cardArr, card);
  var len = 0;

  while (len < cardArr.length - 1) {
    if (cardArr[len].joker === cardArr[len + 1].joker) {
      cardArr.splice(len, 1);
    }

    len++;
  }

  if (cardArr.length < 2) {
    return [];
  }

  var tempArr = [],
      seqArr = [];

  for (var i = 0; i < cardArr.length - 2; i++) {
    tempArr = [cardArr[i], cardArr[i + 1], cardArr[i + 2]];

    if (isOrder(tempArr) && isInclude(tempArr, card)) {
      seqArr.push(tempArr);
    }
  }

  return seqArr;
}
/**
 * 碰
 */


function tripletCard(cardGroup, card) {
  var type = card.type,
      cardArr = cardGroup[type];

  if (cardArr.length < 2) {
    return [];
  }

  var tripArr = [];
  cardArr.forEach(function (item) {
    if (item.id === card.id) {
      tripArr.push(item);
    }
  });

  if (tripArr.length === 2) {
    tripArr.push(card);
    return tripArr;
  } else {
    return [];
  }
}
/**
 * 杠
 */


function quadCard(cardGroup, card) {
  var type = card.type,
      cardArr = cardGroup[type];

  if (cardArr.length < 2) {
    return [];
  }

  var quadArr = [];
  cardArr.forEach(function (item) {
    if (item.id === card.id) {
      quadArr.push(item);
    }
  });

  if (quadArr.length === 3) {
    quadArr.push(card);
    return quadArr;
  } else {
    return [];
  }
}

module.exports = {
  shuffle: shuffle,
  sort: sort,
  insert: insert,
  findCard: findCard,
  groupByType: groupByType,
  sequenceCard: sequenceCard,
  tripletCard: tripletCard,
  quadCard: quadCard
};