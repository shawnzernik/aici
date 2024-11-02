const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "scripts"),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "common",
                    chunks: "all",
                },
                src: {
                    test: /[\\/]src[\\/](components|services)[\\/]/,
                    name: "common",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    entry: {
        login: "./src/tre/pages/login.tsx",
        copyright: "./src/tre/pages/copyright.tsx",
        account: "./src/tre/pages/account.tsx",
        help: "./src/tre/pages/help.tsx",
        lists: "./src/tre/pages/lists.tsx",
        memberships: "./src/tre/pages/memberships.tsx",
        permissions: "./src/tre/pages/permissions.tsx",
        user: "./src/tre/pages/user.tsx",
        group: "./src/tre/pages/group.tsx",
        securable: "./src/tre/pages/securable.tsx",
        menu: "./src/tre/pages/menu.tsx",
        list: "./src/tre/pages/list.tsx",
        setting: "./src/tre/pages/setting.tsx",

        upload: "./src/app/pages/upload.tsx",
        finetune: "./src/app/pages/finetune.tsx",
        chat: "./src/app/pages/chat.tsx",
        search: "./src/app/pages/search.tsx",
        dataset: "./src/app/pages/dataset.tsx",
        prompt: "./src/app/pages/prompt.tsx",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/login.html",
            chunks: ["common", "login"],
            title: "Login"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/copyright.html",
            chunks: ["common", "copyright"],
            title: "Copyright & License"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/account.html",
            chunks: ["common", "account"],
            title: "My Account"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/help.html",
            chunks: ["common", "help"],
            title: "Help"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/lists.html",
            chunks: ["common", "lists"],
            title: "List View"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/memberships.html",
            chunks: ["common", "memberships"],
            title: "Memberships"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/permissions.html",
            chunks: ["common", "permissions"],
            title: "Permissions"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/user.html",
            chunks: ["common", "user"],
            title: "User Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/group.html",
            chunks: ["common", "group"],
            title: "Group Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/list.html",
            chunks: ["common", "list"],
            title: "List Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/securable.html",
            chunks: ["common", "securable"],
            title: "Securable Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/menu.html",
            chunks: ["common", "menu"],
            title: "Menu Edit"
        }),
        new HtmlWebpackPlugin({
            template: "./src/tre/template.html",
            filename: "../static/tre/pages/setting.html",
            chunks: ["common", "setting"],
            title: "Setting Edit"
        }),

        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/upload.html",
            chunks: ["common", "upload"],
            title: "Upload Source Code"
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/finetune.html",
            chunks: ["common", "finetune"],
            title: "Fine Tune"
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/chat.html",
            chunks: ["common", "chat"],
            title: "Chat"
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/search.html",
            chunks: ["common", "search"],
            title: "Search"
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/dataset.html",
            chunks: ["common", "dataset"],
            title: "Data Set"
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/template.html",
            filename: "../static/app/pages/prompt.html",
            chunks: ["common", "prompt"],
            title: "Prompt"
        })
    ]
};