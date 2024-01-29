Object.prototype.filterByValue = function filterObject(filterValue) {
  return Object.fromEntries(Object.entries(this).filter(([key, value]) => value === filterValue));
}