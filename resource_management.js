const express = require('express');
const {
  exec
} = require('child_process');
const fs = require('fs');
const mysql = require('mysql');

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

app.post('/staticProfile', async (request, response) => {
  const {
    resource_type,
    access_key,
    secret_key,
    region,
  } = request;
  const json_path = `${resource_type}-instance/${variable_file}`;
  const cmd_path = `${resource_type}-instance`;
  const select_sql = `select resource_type,access_key,secret_key,region from UserStaticProfile where resource_type=${resource_type}&&access_key=${access_key}&&secret_key=${secret_key};`;
  const insert_sql = `insert into UserStaticProfile (resource_type,access_key,secret_key,region) values (${resource_type},${access_key},${secret_key},${region});`;
  const newData = {
    access_key,
    secret_key,
    region,
  }
  toJson(json_path, newData, resource_type);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.INIT, cmd_path);
  if (code === 0) {
    // 写入数据库
    db.query(select_sql, function (err, result, fields) {
      // 数据库无存储
      if (!result) {
        db.query(insert_sql, function (err, result) {
          if (err) console.error(error.message);

        })
      } else if (result[0].region !== region) {
        // 数据库中有存储，但 region 不一致
        const update_sql = `update UserStaticProfile set region=${region} where resource_type=${resource_type}&&access_key=${access_key}&&secret_key=${secret_key};`;
        db.query(update_sql, function (err, result) {
          if (err) console.error(error.message);
        })
      }
    });
    const res = {
      code,
      command_error: null,
      msg: '静态凭证有效，已执行初始化！'
    }
    response.send(JSON.parse(res));
  } else {
    const res = {
      code,
      command_error: data,
      msg: '静态凭证无效，详情请查看报错信息！'
    }
    response.send(JSON.parse(res));
  }
});

app.post('/applyResource', async (request, response) => {
  const {
    resource_type
  } = request;
  let newData = {};
  const cmd_path = `${resource_type}-instance`;
  switch (resource_type) {
    case RESOURCE_TYPE.AWS:
      newData = {
        instance_type: request.instance_type,
        instance_name: request.instance_name,
        ami_id: request.ami_id,
        cpu_core_count: request.cpu_core_count,
      };
    case RESOURCE_TYPE.ALI:
      newData = {
        instance_type: request.instance_type,
        instance_name: request.instance_name,
        availability_zone: request.availability_zone,
        system_disk_category: request.system_disk_category,
        system_disk_name: request.system_disk_name,
        system_disk_description: request.system_disk_description,
        system_disk_size: request.system_disk_size,
        data_disk_category: request.data_disk_category,
        data_disk_name: request.data_disk_name,
        data_disk_description: request.data_disk_description,
        data_disk_size: request.data_disk_size,
        status: request.status
      };
    case RESOURCE_TYPE.HUAWEI:
      newData = {
        instance_type: request.instance_type,
        instance_name: request.instance_name,
        availability_zone: request.availability_zone,
        image_name: request.image_name,
        system_disk_type: request.system_disk_type,
        system_disk_size: request.system_disk_size,
        data_disk_type: request.data_disk_type,
        data_disk_size: request.data_disk_size,
      };
  }
  updateResourceInfo(newData, resource_type, OPERATION_TYPE.ADD, 0);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.APPLY, cmd_path);
  if (code === 0) {
    const res = {
      code,
      command_error: null,
      msg: '资源创建成功！'
    };
    response.send(JSON.parse(res));
  } else {
    const res = {
      code,
      command_error: cmd_info,
      msg: '资源创建失败，原因请查看报错信息！'
    };
    response.send(JSON.parse(res));
  }
});

app.post('/destroyResource', async (request, response) => {
  const {
    resource_type,
    instance_id
  } = request;
  let res = {};
  const cmd_path = `${resource_type}-instance`;
  const {
    code: search_code,
    info
  } = await getInstanceInfo(resource_type, instance_id);
  if (search_code === 0) {
    updateResourceInfo(null, resource_type, OPERATION_TYPE.DELETE, info.index);
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
      response.send(JSON.parse(res));
    } else {
      res = {
        code,
        command_error: cmd_info,
        msg: '资源销毁失败，详情请查看报错信息！'
      };
      response.send(JSON.parse(res));
    }
  } else {
    res = {
      code,
      command_error: info,
      msg: '资源销毁失败，详情请查看报错信息！'
    };
    response.send(JSON.parse(res));
  }
});

app.post('/showSingleResource', async (request, response) => {
  const {
    resource_type,
    instance_id
  } = request;
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
    response.send(JSON.parse(res));
  } else if (code === 2) {
    res = {
      code: 1,
      command_error: null,
      msg: info,
      result: null
    }
    response.send(JSON.parse(res));
  } else {
    res = {
      code,
      command_error: info,
      msg: '资源信息查看失败，详情请查看报错信息',
      result: null
    }
    response.send(JSON.parse(res));
  }
});

app.post('/updateInstanceInfo', async (request, response) => {
  const {
    resource_type,
    instance_index,
    modified_result
  } = request;
  const cmd_path = `${resource_type}-instance`;
  let res = {};
  updateResourceInfo(modified_result, resource_type, OPERATION_TYPE.MODIFY, instance_index);
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
    response.send(JSON.parse(res));
  } else {
    res = {
      code,
      command_error: cmd_info,
      msg: '资源更新失败，详情请查看报错信息！'
    }
    response.send(JSON.parse(res));
  }
});

app.post('/showResourceInfo', (request, response) => {
  const {
    resource_type
  } = request;
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
    response.send(JSON.parse(res));
  } else {
    const res = {
      code,
      command_error: cmd_info,
      msg: '资源信息查看失败，详情请查看报错信息！',
      result: null,
    }
    response.send(JSON.parse(res));
  }
});

// 命令行执行
function execute(cmd, working_path) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {
      cwd: working_path
    }, function (error, stdout, stderr) {
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
          stdout
        });
      }
    });
  });
}

// execute('dir', 'aws-instance', getData);
// execute('terraform apply --auto-approve', 'aws-instance');
// execute('terraform state show module.aws_resources[0].aws_instance.instance', 'aws-instance');
// execute('terraform plan', 'aws-instance');

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


async function toJson(file, newData, resource_type, ) {
  // resource_type: aws_props huawei_props ali_props
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_props`
  const data = await fromJson(file);
  Object.keys(newData).forEach(key => {
    data[type][key] = newData[key];
  });
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file, json_data);
}

async function updateResourceInfo(newData, resource_type, operation_type, index) {
  // resource_type: aws_props huawei_props ali_props
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_props`
  const file_path = `${resource_type}-instance/${variable_file}`;
  const data = await fromJson(file_path);

  switch (operation_type) {
    case OPERATION_TYPE.ADD:
      if (data[type].instance_count) data[type].instance_count += 1;
      else data[type].instance_count = 1;
      Object.keys(newData).forEach(key => {
        data[type][key] = [...data[type][key], newData[key]];
      });
    case OPERATION_TYPE.MODIFY:
      Object.keys(newData).forEach(key => {
        data[type][key][index] = newData[key];
      });
    case OPERATION_TYPE.DELETE:
      data[type].instance_count -= 1;
      Object.keys(newData).forEach(key => {
        data[type][key][index].splice(index, 1);
      });
  }
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file, json_data);
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
    instance_info.forEach((item, index) => {
      if (item.values.id === instance_id) {
        return {
          code,
          info: {
            index,
            item
          }
        };
      }
    })
    return {
      code: 2,
      info: "该资源尚未创建！"
    };
  } else {
    return {
      code,
      info: cmd_info
    };
  }
}
