export const parseJSONToObj = (json) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
};
