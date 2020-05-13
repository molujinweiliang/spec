const cartesian = (arr) => {
    if (arr.length < 2) return arr[0] || [];
    return [].reduce.call(arr, function (col, set) {
        let res = [];
        col.forEach(c => {
            set.forEach(s => {
                let t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
            })
        });
        return res;
    });
}
// 判断两个对象是否相等
const isObjEqual = (o1,o2) => {
  var props1 = Object.getOwnPropertyNames(o1);
  var props2 = Object.getOwnPropertyNames(o2);
  if (props1.length != props2.length) {
    return false;
  }
  for (var i = 0,max = props1.length; i < max; i++) {
    var propName = props1[i];
    if (o1[propName] !== o2[propName]) {
      return false;
    }
  }
  return true;
}

export default {
	cartesian,
	isObjEqual,
};
