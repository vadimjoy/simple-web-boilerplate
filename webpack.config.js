const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/html/views");

const config = {
  entry: ["./src/js/index.js", "./src/scss/style.scss"],
  output: {
    filename: "./js/[name].bundle.js"
  },
  devtool: "source-map",
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: true
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 200000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: true,
              plugins: () => [
                require("cssnano")({
                  preset: [
                    "default",
                    {
                      discardComments: {
                        removeAll: true
                      }
                    }
                  ]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // {
      //   test: /\.html$/,
      //   include: path.resolve(__dirname, "src/html/includes"),
      //   use: ["raw-loader"]
      // },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              name: '[name].[ext]',
              pretty: true
            }
          }]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/style.bundle.css"
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/fonts/generated",
        to: "./fonts"
      },
      {
        from: "./src/favicon",
        to: "./"
      },
      {
        from: "./src/img",
        to: "./img"
      },
      {
        from: "./src/uploads",
        to: "./uploads"
      }
    ])
  ].concat(htmlPlugins).concat(
      new HtmlWebpackPugPlugin(),
  ),
};

module.exports = (env, argv) => {
  if (argv.mode === "production") {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
