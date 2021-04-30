/**
 * Here lies the configurations for the app
 */

// dependencies
const lib = {};

lib.staging = {
  httpPort: 3001,
  httpsPort: 3002,
  envName: 'staging',
  appName: 'pizza-delivery',
};

lib.production = {
  httpPort: 5001,
  httpsPort: 5002,
  envName: 'production',
  appName: 'pizza-delivery',
};

const moduleToExport =
  process.env.NODE_ENV === 'production' ? lib['production'] : lib['staging'];

export default moduleToExport;
