const FtpDeploy = require("ftp-deploy")
const package = require("./package.json")
const chalk = require("chalk")

const ftp = new FtpDeploy()

let pathFolder = __dirname.split("\\")
pathFolder.pop()
pathFolder = pathFolder.join("\\")

const config = {
    user: "eurodesarrollo",
    // Password optional, prompted if none given
    host: "30.0.0.36",
    localRoot: pathFolder,
    remoteRoot: `/Maco/DesktopModules/Progrentis/Programa/ConsolaEjercicio/2020/${package.name}`,
    // include: ["*", "**/*"],      // this would upload everything except dot files
    include: ["*.txt", "dist/**/*", "dist/**/.*", "*.ascx", "*.vb"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: [
        "lib/**/*",
        "node_modules/**/*",
        "node_modules/**/.*",
        ".git/**", "lib/**/.*",
        "lib/node_modules/ftp-deploy/test/local/.excludeme/folder/excluded.txt",
        "lib/node_modules/ftp-deploy/test/local/.excludeme/excluded.txt"
    ],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: true,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: false
};

const clearLastLine = () => {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
  }

ftp.on("uploading", (data) => {
    clearLastLine();
    console.log(chalk.bgBlue.white.bold(` 🚀  Uploading files: ${data.transferredFileCount} of ${data.totalFilesCount} `))
    // console.log(data.totalFilesCount); // total file count being transferred
    // console.log(data.transferredFileCount); // number of files transferred
    // console.log(data.filename); // partial path with filename being uploaded
});

ftp.deploy(config)
    .then(()=> {
        clearLastLine();
        console.log(chalk.bgBlue.white.bold(` ✔  Code was deploy `))
    })
    .catch(err => console.log(err))
    // .then(() => console.log(chalk.bgBlue.white.bold(` Finished `)))
    // .catch(err => console.log(err))