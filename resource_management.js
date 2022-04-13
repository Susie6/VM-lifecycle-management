var exec = require('child_process').exec;
function execute(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    if (error !== null) {
      console.error(error);
      console.log("failed")
      console.log(stdout);
      console.log(stderr);
    } else {
      console.log("success");
      console.log(stdout);
      console.log(stderr);
    }
  });

}
execute('terraform init');