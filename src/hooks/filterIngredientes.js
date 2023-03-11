export default function filterIngredientes(objectToReduce, string) {
  const newObject = Object.keys(objectToReduce)
    .filter((key) => key.includes(string))
    .reduce((cur, key) => Object.assign(cur, { [key]: objectToReduce[key] }), {});
  const filteredObject = Object
    .fromEntries(Object.entries(newObject).filter(([key, value]) => (
      value !== null && value !== key && value !== ' ' && value !== '')));
  return Object.values(filteredObject);
}
