const corsConfig = {
  origin: [
    /^http:\/\/localhost(:[0-9]{0,4})?\/?$/,
  ],
  methods: ['OPTIONS', 'POST'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = {
  corsConfig,
};
