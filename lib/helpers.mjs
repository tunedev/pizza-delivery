const lib = {};

lib.parseJSONToObj = (json) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
};

export default lib;
