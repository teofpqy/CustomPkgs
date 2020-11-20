//#! bin/node
const fs = require('fs').promises;
const path = require('path');
const exec = require('child_process').exec;

const bucketDir = path.resolve(__dirname, '../bucket');
const readMePath = path.resolve(__dirname, '../README.md');
// get all file path in bucket




const generatorReadMe = async (apps) => {
    const readme = `
## 软件列表
> 共有软件 ${apps.length} 款

| 软件名字 | 软件简介| 版本|
|-|-|-|
${
    apps.map((x) => `[${x.description}](${x.homepage})| ${x.notes.join('')} | ${x.version}|`).join('\n')
}

`
    return fs.writeFile(readMePath, readme);
}

const pushToGit = async () => {
    const commitMsg = `auto Update README.md`;
    return new Promise((resolve, reject) => {
        exec(`git commit --message ${commitMsg} --only "README.md"`, (error, stdout) => {
            if (!error) {
                exec('git push');
                return resolve();
            }
            return reject();
        });
    });
}

(async () => {
    const apps = await fs.readdir(bucketDir).then(async (pahtList) => {
        const jsonList = await pahtList.filter((x) => x.endsWith('.json') || x.endsWith('.jsonc'))
            .map((x) => path.join(bucketDir, x))
            .filter(async (x) => (await fs.stat(x)).isFile());
        return jsonList.map((x) => require(x));
    });
    await generatorReadMe(apps);
    await pushToGit();
})()


