const corsConfig = {
  origin: [
    /^http:\/\/localhost(:[0-9]{0,4})?\/?$/,
  ],
  methods: ['OPTIONS', 'POST'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

const formatError = (error) => {
  if (process.env.NODE_ENV === 'development') console.error(error);
  return error;
};

module.exports = {
  corsConfig,
  formatError,
};
