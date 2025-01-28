module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // Necesario si usas resolve-url-loader
            },
          },
        ],
      },
    ],
  },
};
