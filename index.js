const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const process = require("process");
async function run() {
    try {
        let os = process.env.RUNNER_OS;
        let porterUrl;
        switch (os) {
            case "Windows":
                porterURL = `https://cdn.deislabs.io/porter/latest/install-windows.ps1`;
                break;
            case "MacOS":
                porterURL = `https://cdn.deislabs.io/porter/latest/install-mac.sh`;
                break;
            case "Linux":
                porterURL = `https://cdn.deislabs.io/porter/latest/install-linux.sh`;
                break;
            default:
                throw `Unknown OS: ${os}`;
        }

        console.log(`Downloading Porter from ${porterURL}`);
        const porterInstallPath = await tc.downloadTool(`${porterURL}`);

        switch (os) {
            case "Windows":
                await exec.exec(`pwsh`, [`-f`, `${porterInstallPath}`]);
                core.addPath(`${process.env.USERPROFILE}/.porter`);
                break;
            case "MacOS":
            case "Linux":
                await exec.exec(`chmod`, [`+x`, `${porterInstallPath}`]);
                await exec.exec(`bash`, [`-c`, `${porterInstallPath}`]);
                core.addPath("/home/runner/.porter");
                break;
            default:
                throw `Unknown OS: ${os}`;
        }


    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
