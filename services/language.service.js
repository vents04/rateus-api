const fs = require('fs');

class LanguageService {
    getLanguageData(language, page) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(`./languages/${language}.json`)) {
                fs.readFile(`./languages/${language}.json`, function (err, data) {
                    if (err) {
                        reject({
                            'errorCode': 500
                        })
                    } else {
                        const pageObject = JSON.parse(data)[page];
                        resolve(pageObject);
                    }
                })
            } else {
                fs.readFile(`./languages/EN.json`, function (err, data) {
                    if (err) {
                        reject({
                            'errorCode': 500
                        })
                    } else {
                        const pageObject = JSON.parse(data)[page];
                        resolve(pageObject)
                    }
                })
            }
        })
    }
}

module.exports.LanguageService = LanguageService;