export default function filterObject(obj: any, filterValue: any) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value === filterValue));
}