const express = require('express');
const {
  exec
} = require('child_process');
const fs = require('fs');

function myTest(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {
      maxBuffer: 1024 * 2000,
      cwd: 'aws-instance'
    }, function (err, stdout, stderr) {
      const code = 1;
      if (err) {
        // console.log("aws: ", err);
        resolve({code, err});
      } else if (stderr.lenght > 0) {
        reject(new Error(stderr.toString()));
      } else {
        // console.log(stdout);
        resolve(stdout);
      }
    });
  });
};

async function tryTest() {
  console.log("h");
  // myTest('ls').then(data => {
  //   console.log("data: ", data);
  // });
  const data = await myTest('ls');
  return data;
}
// tryTest().then(data=> {
//   console.log("async: ", data);
// });
async function aaa(){
  const d = await tryTest();
  console.log("aaaaa: ", d);
}
aaa()

// function execute(cmd, working_path, callback) {
//   exec(cmd, {
//     cwd: working_path
//   }, function (error, stdout, stderr) {
//     let code = 0;
//     if (error !== null) {
//       code = 1;
//       console.log("failed")
//       // console.error(error);
//       callback(code, error)
//     } else {
//       console.log("success");
//       // console.log(stdout);
//       // console.log(stderr);
//       callback(code, stdout)
//     }
//   });
// }

app.post('/register', (request, response) => {
  const {
    user_id,
    password,
    confirm_password
  } = request;
  const sql = `select user_id from UserInfo where user_id=${user_id}`;
  db.query(sql, function (err, result) {
    if (result) {
      const data = {
        code: 1,
        msg: '该用户名已存在，请重新设置用户名'
      };
      let str = JSON.stringify(data);
      response.send(str);
    } else if (password !== confirm_password) {
      const data = {
        code: 1,
        msg: '两次输入的密码不一致，请重新输入'
      };
      let str = JSON.stringify(data);
      response.send(str);
    } else {
      const data = {
        code: 0,
        msg: '注册成功！'
      };
      let str = JSON.stringify(data);
      response.send(str);
    }
  });
});

app.post('/login', (request, response) => {
  const {
    user_id,
    user_password,
  } = request;
  const sql = `select user_id, user_password from UserInfo where user_id=${user_id}`;
  db.query(sql, function (err, result, fields) {
    if (result[0].user_id === user_id && result[0].user_password === user_password) {
      const data = {
        code: 0,
        msg: '登录成功！'
      };
      let str = JSON.stringify(data);
      response.send(str);
    } else {
      const data = {
        code: 1,
        msg: '登录失败，请检查用户名或者密码！'
      };
      let str = JSON.stringify(data);
      response.send(str);
    }
  });
});