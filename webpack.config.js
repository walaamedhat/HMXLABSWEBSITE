const webpack = require("webpack"); //to access built-in plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const generateHtmlPlugin = ({ src, file, fileName }) => {
  return new HtmlWebpackPlugin({
    title: src,
    filename: fileName,
    template: `./src/${src.toLowerCase()}/${file}`,
    inject: 'body'
  });
};

const populateHtmlPlugins = (pagesArray) => {
  res = [];
  pagesArray.forEach((page) => {
    res.push(generateHtmlPlugin(page));
  });
  return res;
};

const pages = populateHtmlPlugins([
  { src: "Consulting", file: "index.html", fileName: "consulting.html" },
  { src: "Hpc", file: "index.html", fileName: "hpc.html" },
  { src: "Hpc/case-study", file: "financial-services-cloud-migration.html", fileName: "financial-services-cloud-migration.html" },
  { src: "Hpc/product", file: "workload-tracking.html", fileName: "workload-tracking.html" },
  { src: "Hpc/product", file: "intro-meeting.html", fileName: "intro-meeting.html" },
  { src: "Hpc/product", file: "financial-services-benchmark.html", fileName: "financial-services-benchmark.html" },
  { src: "Hpc/product", file: "evaluation.html", fileName: "evaluation.html" },
  { src: "Hpc/product", file: "cloud-vm-optimisation.html", fileName: "cloud-vm-optimisation.html" },
  { src: "Hpc/product", file: "cloud-vm-benchmarking-as-service.html", fileName: "cloud-vm-benchmarking-as-service.html" },
  { src: "Hpc/product", file: "cloud-orchestration.html", fileName: "cloud-orchestration.html" },
  { src: "Hpc/product", file: "cloud-benchmark-data.html", fileName: "cloud-benchmark-data.html" },
]);

module.exports = {
  mode: "production",
  devtool: 'inline-source-map',
  // mode: "development",
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist/build",
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3001,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  plugins: [
    new CopyPlugin({
      // patterns: ['*.html']
      patterns: [
        {
          from: path.resolve(__dirname, "./src/consulting/*"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new CopyPlugin({
      // patterns: ['*.html']
      patterns: [
        {
          from: path.resolve(__dirname, "./src/hpc/*"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "cookies.html",
      template: "./src/cookies.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "privacy.html",
      template: "./src/privacy.html",
      chunks: ["main"],
    }),
    ...pages,

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/assets/img/"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      { test: /\.txt$/, use: "raw-loader" },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // type: "asset",
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name]",
        },
        use: [{
          loader: 'image-webpack-loader',
          options: {
              pngquant: {
                  quality: [.90, .95],
              },
          }
      }],
      },
      //   {// may work
      //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //     type: "asset/resource",
      //   },

      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            // interpolate: true,
            sources: {
              list: [
                {
                  tag: "img",
                  attribute: "data-src",
                  type: "src",
                },
              ],
            },
          },
        },
      },

      // {
      //   test: /\.(css)$/,
      //   use: ["style-loader", "css-loader"],
      // },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // {
      //   test: /\.(scss)$/,
      //   use: [{
      //     loader: 'style-loader', // inject CSS to page
      //   }, {
      //     loader: 'css-loader', // translates CSS into CommonJS modules
      //   }, {
      //     loader: 'postcss-loader', // Run post css actions
      //     options: {
      //       plugins: function () { // post css plugins, can be exported to postcss.config.js
      //         return [
      //           require('precss'),
      //           require('autoprefixer')
      //         ];
      //       }
      //     }
      //   }, {
      //     loader: 'sass-loader' // compiles Sass to CSS
      //   }]
      // },
      {
        test: /\.(s(a|c)ss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: "url?limit=10000&mimetype=application/octet-stream" }],
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: [{ loader: "file" }] },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: "url?limit=10000&mimetype=image/svg+xml" }],
      },
    ],
  },
  // optimization: {
  //   minimizer: [
  //     "...",
  //     new ImageMinimizerPlugin({
  //       minimizer: {
  //         implementation: ImageMinimizerPlugin.imageminMinify,
  //         options: {
  //           // Lossless optimization with custom option
  //           // Feel free to experiment with options for better result for you
  //           plugins: [
  //             ["gifsicle", { interlaced: true }],
  //             ["jpegtran", { progressive: true }],
  //             ["optipng", { optimizationLevel: 5 }],
  //             // Svgo configuration here https://github.com/svg/svgo#configuration
  //             [
  //               "svgo",
  //               {
  //                 plugins: [
  //                   {
  //                     name: "preset-default",
  //                     params: {
  //                       overrides: {
  //                         removeViewBox: false,
  //                         addAttributesToSVGElement: {
  //                           params: {
  //                             attributes: [
  //                               { xmlns: "http://www.w3.org/2000/svg" },
  //                             ],
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 ],
  //               },
  //             ],
  //           ],
  //         },
  //       },
  //     }),
  //   ],
  // },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
    minimize: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
  // watch: false,
  // watchOptions: { poll: true },
};
