const express = require('express');
const {
  exec
} = require('child_process');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'clouddb'
});
db.connect(err => {
  if (err) throw err;
  console.log("database connnected!");
});
const RESOURCE_TYPE = {
  AWS: 'aws',
  ALI: 'ali',
  HUAWEI: 'huawei'
}
const variable_file = 'terraform.tfvars.json';
const TERRAFORM_COMMANDS = {
  INIT: 'terraform init',
  APPLY: 'terraform apply --auto-approve',
  DESTROY: 'terraform destroy',
  REFRESH: 'terraform apply -refresh-only',
  SHOW_ALL_RESOURCE: 'terraform state list',
  SHOW_RESOURCES_INFO: 'terraform show -json',
}
const OPERATION_TYPE = {
  ADD: 'add',
  MODIFY: 'modify',
  DELETE: 'delete'
}

// 请求构建
const app = express();
app.use(bodyParser());
app.use((req, res, next) => {
  //设置请求头
  res.set({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Max-Age': 1728000,
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  })
  req.method === 'OPTIONS' ? res.status(204).end() : next()
})

function test() {
  console.log("testing");
}

app.post('/staticProfile', async (request, response) => {
  const {
    resource_type,
    access_key,
    secret_key,
    region,
  } = request.body;
  const json_path = `${resource_type}-instance/${variable_file}`;
  const cmd_path = `${resource_type}-instance`;
  const select_sql = `select resource_type,access_key,secret_key,region from UserStaticProfile where resource_type='${resource_type}';`;
  const insert_sql = `insert into UserStaticProfile (resource_type,access_key,secret_key,region) values ('${resource_type}','${access_key}','${secret_key}','${region}');`;
  const newData = {
    access_key,
    secret_key,
    region,
  }
  await toJson(json_path, newData, resource_type);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.INIT, cmd_path);
  let res = {};
  if (code === 0) {
    console.log(cmd_info);
    // 写入数据库
    db.query(select_sql, function (err, result, fields) {
      // 数据库无存储
      if (result.length === 0) {
        db.query(insert_sql, function (err, result) {
          if (err) {
            res = {
              code: 1,
              command_error: err.message,
              msg: '静态凭证有效，但写入数据库失败，请重新再试！'
            };
          } else {
            res = {
              code,
              command_error: null,
              msg: '静态凭证有效，已执行初始化！'
            };
          }
        })
        response.send(JSON.stringify(res));
      } else if (result[0].region !== region || result[0].access_key !== access_key || result[0].secret_key !== secret_key) {
        // 数据库中有存储，但不一致
        const update_sql = `update UserStaticProfile set region='${region}',access_key='${access_key}',secret_key='${secret_key}' where resource_type='${resource_type}';`;
        db.query(update_sql, function (err, result) {
          if (err) {
            res = {
              code: 1,
              command_error: err.message,
              msg: '静态凭证有效，但写入数据库失败，请重新再试！'
            };
          } else {
            res = {
              code,
              command_error: null,
              msg: '静态凭证有效，已执行初始化！'
            };
          }
        })
        response.send(JSON.stringify(res));
      } else {
        // 数据库中有，无需新增
        res = {
          code,
          command_error: null,
          msg: '静态凭证有效，已执行初始化！'
        };
        response.send(JSON.stringify(res));
      }
    });
  } else {
    res = {
      code,
      command_error: cmd_info,
      msg: '静态凭证无效，详情请查看报错信息！'
    }
    response.send(JSON.stringify(res));
  }
});

app.post('/applyResource', async (request, response) => {
  const {
    resource_type
  } = request.body;
  let newData = {};
  const cmd_path = `${resource_type}-instance`;
  if (resource_type === RESOURCE_TYPE.AWS) {
    newData = {
      instance_type: request.body.instance_type,
      instance_name: request.body.instance_name,
      ami_id: request.body.ami_id,
    };
  } else if (resource_type === RESOURCE_TYPE.ALI) {
    newData = {
      instance_type: request.body.instance_type,
      instance_name: request.body.instance_name,
      availability_zone: request.body.availability_zone,
      system_disk_category: request.body.system_disk_category,
      system_disk_name: request.body.system_disk_name,
      system_disk_description: request.body.system_disk_description,
      system_disk_size: request.body.system_disk_size,
      data_disk_category: request.body.data_disk_category,
      data_disk_name: request.body.data_disk_name,
      data_disk_description: request.body.data_disk_description,
      data_disk_size: request.body.data_disk_size,
      // status: request.body.status
    };
  } else if (resource_type === RESOURCE_TYPE.HUAWEI) {
    newData = {
      instance_type: request.body.instance_type,
      instance_name: request.body.instance_name,
      availability_zone: request.body.availability_zone,
      image_name: request.body.image_name,
      system_disk_type: request.body.system_disk_type,
      system_disk_size: request.body.system_disk_size,
      data_disk_type: request.body.data_disk_type,
      data_disk_size: request.body.data_disk_size,
    };
  }
  await updateResourceInfo(newData, resource_type, OPERATION_TYPE.ADD, 0);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.APPLY, cmd_path);
  if (code === 0) {
    console.log(cmd_info);
    const res = {
      code,
      command_error: null,
      msg: '资源创建成功！'
    };
    response.send(JSON.stringify(res));
  } else {
    console.log(cmd_info);
    const res = {
      code,
      command_error: cmd_info,
      msg: '资源创建失败，原因请查看报错信息！'
    };
    response.send(JSON.stringify(res));
  }
});

app.post('/destroyResource', async (request, response) => {
  const {
    resource_type,
    instance_id
  } = request.body;
  let res = {};
  const cmd_path = `${resource_type}-instance`;
  const {
    code: search_code,
    info
  } = await getInstanceInfo(resource_type, instance_id);
  if (search_code === 0) {
    const instance_index = info.index;
    //module.aws_resources[0].aws_instance.instance
    const cmd = `${TERRAFORM_COMMANDS.DESTROY} -target module.${resource_type}_resources[${instance_index}].${resource_type}_instance.instance`;
    const result = await execute(cmd, cmd_path);
    await updateResourceInfo(null, resource_type, OPERATION_TYPE.DELETE, instance_index);
    const {
      code,
      cmd_info
    } = await execute(TERRAFORM_COMMANDS.APPLY, cmd_path);
    if (code === 0) {
      res = {
        code,
        command_error: null,
        msg: '资源销毁成功！'
      };
      response.send(JSON.stringify(res));
    } else {
      res = {
        code,
        command_error: cmd_info,
        msg: '资源销毁失败，详情请查看报错信息！'
      };
      response.send(JSON.stringify(res));
    }
  } else {
    res = {
      code,
      command_error: info,
      msg: '资源销毁失败，详情请查看报错信息！'
    };
    response.send(JSON.stringify(res));
  }
});

app.post('/showSingleResource', async (request, response) => {
  const {
    resource_type,
    instance_id
  } = request.body;
  let res = {};
  const {
    code,
    info
  } = await getInstanceInfo(resource_type, instance_id);
  if (code === 0) {
    res = {
      code,
      command_error: null,
      msg: '资源信息查看成功',
      result: info
    }
    response.send(JSON.stringify(res));
  } else if (code === 2) {
    res = {
      code: 1,
      command_error: null,
      msg: info,
      result: null
    }
    response.send(JSON.stringify(res));
  } else {
    res = {
      code,
      command_error: info,
      msg: '资源信息查看失败，详情请查看报错信息',
      result: null
    }
    response.send(JSON.stringify(res));
  }
});

app.post('/updateInstanceInfo', async (request, response) => {
  const {
    resource_type,
    instance_index,
    modified_result
  } = request.body;
  const cmd_path = `${resource_type}-instance`;
  let res = {};
  await updateResourceInfo(modified_result, resource_type, OPERATION_TYPE.MODIFY, instance_index);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.APPLY, cmd_path);
  if (code === 0) {
    res = {
      code,
      command_error: null,
      msg: '资源更新成功！'
    }
    response.send(JSON.stringify(res));
  } else {
    res = {
      code,
      command_error: cmd_info,
      msg: '资源更新失败，详情请查看报错信息！'
    }
    response.send(JSON.stringify(res));
  }
});

app.post('/showResourceInfo', async (request, response) => {
  const {
    resource_type
  } = request.body;
  const cmd_path = `${resource_type}-instance`;
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.SHOW_RESOURCES_INFO, cmd_path);
  if (code === 0) {
    const json_data = JSON.parse(cmd_info);
    const instance_info = json_data.values.root_module.child_modules[0].resources;
    const res = {
      code,
      command_error: null,
      msg: '资源信息查看成功！',
      result: instance_info
    }
    response.send(JSON.stringify(res));
  } else {
    const res = {
      code,
      command_error: cmd_info,
      msg: '资源信息查看失败，详情请查看报错信息！',
      result: null,
    }
    response.send(JSON.stringify(res));
  }
});

// 命令行执行
function execute(cmd, working_path) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {
      cwd: working_path,
      maxBuffer: 2000 * 1024,
    }, function (error, stdout, stderr) {
      console.log('here')
      let code = 0;
      if (error) {
        code = 1;
        resolve({
          code,
          cmd_info: error
        });
      } else if (stderr.length > 0) {
        code = 1;
        resolve({
          code,
          cmd_info: new Error(stderr)
        });
      } else {
        resolve({
          code,
          cmd_info: stdout
        });
      }
    });
  });
}

// json 解析
function fromJson(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) return reject(error);
      const parse_data = JSON.parse(data.toString())
      return resolve(parse_data);
    });
  });
};


async function toJson(file, newData, resource_type) {
  // resource_type: aws_props huawei_props ali_props
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_props`
  const data = await fromJson(file);
  Object.keys(newData).forEach(key => {
    data[type][key] = newData[key];
  });
  const json_data = JSON.stringify(data, null, "\t");
  // const file_descriptor = fs.openSync(file); 
  fs.writeFileSync(file, json_data);
  // fs.close(file_descriptor, function (err) {
  //   if (err) {
  //     console.log(err)
  //   }

  //   console.log("关闭文件")
  // })
  console.log("写入文件")
}

async function updateResourceInfo(newData, resource_type, operation_type, index) {
  // resource_type: aws_props huawei_props ali_props
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_props`
  const file_path = `${resource_type}-instance/${variable_file}`;
  const data = await fromJson(file_path);
  if (operation_type === OPERATION_TYPE.ADD) {
    if (data[type].instance_count) data[type].instance_count += 1;
    else data[type].instance_count = 1;
    Object.keys(newData).forEach(key => {
      if (data[type][key] !== undefined) data[type][key].push(newData[key]);
    });
  } else if (operation_type === OPERATION_TYPE.MODIFY) {
    Object.keys(newData).forEach(key => {
      data[type][key][index] = newData[key];
    });
  } else if (operation_type === OPERATION_TYPE.DELETE) {
    data[type].instance_count -= 1;
    Object.keys(newData).forEach(key => {
      data[type][key][index].splice(index, 1);
    });
  }
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file_path, json_data);
}

async function getInstanceInfo(resource_type, instance_id) {
  const cmd_path = `${resource_type}-instance`;
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.SHOW_RESOURCES_INFO, cmd_path);
  if (code === 0) {
    const json_data = JSON.parse(cmd_info);
    const instance_info = json_data.values.root_module.child_modules[0].resources;
    let res = {
      code: 2,
      info: "该资源尚未创建！"
    };
    instance_info.forEach((item, index) => {
      if (item.values.id === instance_id) {
        res = {
          code,
          info: {
            index,
            item
          }
        };
      }
    })
    return res;
  } else {
    return {
      code,
      info: cmd_info
    };
  }
}
app.listen(8000, () => {
  console.log("listening 8000……");
});