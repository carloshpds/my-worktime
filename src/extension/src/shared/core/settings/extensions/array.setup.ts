Array.prototype.groupByKey = function (key) {
  return this.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {})
}