const fs = require('fs').promises;
const path = require('path');
const cp = require('child_process');

const bucketDir = path.resolve(__dirname, '../bucket');
const readMePath = path.resolve(__dirname, '../README.md');
// get all file path in bucket


const generatorReadMe = async (apps) => {
    const readme = `
## 软件列表
> 共有软件 ${apps.length} 款

| 软件名字 | 软件简介| 版本|
|-|-|-|
${apps.map((x) => `[${x.description}](${x.homepage})| ${
    Array.isArray(x.notes) ? x.notes.join('') : x.notes} | ${x.version}|`).join('\n')}

`
    return fs.writeFile(readMePath, readme);
}


(async () => {
    const apps = await fs.readdir(bucketDir).then(async (pahtList) => {
        const jsonList = await pahtList.filter((x) => x.endsWith('.json') || x.endsWith('.jsonc'))
            .map((x) => path.join(bucketDir, x))
            .filter(async (x) => (await fs.stat(x)).isFile());
        return jsonList.map((x) => require(x));
    });
    await generatorReadMe(apps);
})()


