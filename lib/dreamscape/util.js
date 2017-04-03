(function() {
  var _clean = function(object) {
    var cleaner = {};

    for (var variable in object) {
      if (object.hasOwnProperty(variable)) {
        // console.log('variable: '+variable);

        if(variable === 'key') {
          cleaner[object[variable].$value] = object['value'].$value
        } else
        if(variable !== 'attributes' && variable !== 'value') {
          if(typeof object[variable].$value !== 'undefined') {
            cleaner[variable] = object[variable].$value;
          } else {
            if((typeof object[variable].item !== 'undefined') ||
              (typeof object[variable].A !== 'undefined')) {
              cleaner[variable] = _itemArray(object[variable]);
            } else {
              cleaner[variable] = _clean(object[variable]);
            }
          }
        }
      }
    }

    return cleaner;
  };
  module.exports._clean = _clean;

  var _array = function(array) {
    var obj = _clean(array);

    return Object.keys(obj).map(function (key) { return obj[key]; });
  };
  module.exports._array = _array;

  var _itemArray = function(object) {
    var arr = [], array;

    if(typeof object.item !== 'undefined')
      array = object.item;
    if(typeof object.A !== 'undefined')
      array = object.A.item;

    for (var i = 0; i < array.length; i++) {
      if((typeof array[i].item !== 'undefined')) {
        arr.push(_itemArray(array[i]));
      } else {
        arr.push(_clean(array[i]));
      }
    }

    return arr
  };
  module.exports._itemArray = _itemArray;

}).call(this);
