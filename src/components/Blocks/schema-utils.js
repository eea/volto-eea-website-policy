export const getVoltoStyles = (props) => {
  const styles = props ? props : {};
  const output = {};
  for (const [key, value] of Object.entries(styles)) {
    if (key === '@type') {
      continue;
    }
    if (styles[key] === true) {
      output[key] = key;
    } else {
      output[value] = value;
    }
  }
  return output;
};
