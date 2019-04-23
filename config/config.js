const path = require('path');
const fs = require('fs');
const glob = require('glob');
const argv = require('yargs').argv;

// 获取绝对路径
const resolvePath = dir => {
    return path.resolve(__dirname, '../', dir);
};

// 获取入口文件
const entriesPage = (entryPath => {
    let baseName,
        pathName,
        filesPath,
        filesList = {},
        excludes = [];

    filesPath = glob.sync(`${entryPath}/*/*.js`, {
        ignore: excludes
    });

    filesPath.forEach((entry, index) => {
        baseName = path.basename(entry, path.extname(entry));
        pathName = entry.split('src/pages/')[1].split('/')[0];

        let pagesEntry = !argv['pages'] ? [] : argv['pages'].split(',');
        if (pagesEntry.length) {
            pagesEntry.forEach((item, index) => {
                if (entry.indexOf(`pages/${item}`) > -1) {
                    filesList[pathName + '/' + baseName] = entry;
                }
            });
        } else {
            filesList[pathName + '/' + baseName] = entry;
        }
    });

    return filesList;
})(resolvePath('src/pages'));

// 获取页面模板参数
const htmlPages = (entriesPage => {
    let resultFiles = [];

    entriesPage.forEach((entry, index) => {
        let htmlPlugin = {
            filename: entry.split('/')[1],
            filedir: entry.split('/')[0],
            chunks: ['manifest', 'vendor', entry]
        };
        resultFiles.push(htmlPlugin);
    });

    return resultFiles;
})(Object.keys(entriesPage));

const existStatic = (() => {
    return fs.existsSync(resolvePath('static'));
})();

module.exports = {
	resolvePath,
	htmlPages,
	entriesPage,
    existStatic
};