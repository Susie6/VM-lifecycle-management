const express = require('express');
const {
  exec
} = require('child_process');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");

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

function encode(str) {
  const wordArray = CryptoJS.enc.Utf8.parse(str);
  const base64 = CryptoJS.enc.Base64.stringify(wordArray);
  return base64;
}

function decode(str) {
  const parsedWordArray = CryptoJS.enc.Base64.parse(str);
  const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
  return parsedStr;
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
  const real_secret_key = decode(secret_key);
  const insert_sql = `insert into UserStaticProfile (resource_type,access_key,secret_key,region) values ('${resource_type}','${access_key}','${real_secret_key}','${region}');`;
    const newData = {
      access_key,
      secret_key: real_secret_key,
      region,
    }
  const oldData = await toJson(json_path, newData, resource_type);
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.INIT, cmd_path);
  let res = {};
  if (code === 0) {
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
      } else if (result[0].region !== region || result[0].access_key !== access_key || result[0].secret_key !== real_secret_key) {
        // 数据库中有存储，但不一致
        const update_sql = `update UserStaticProfile set region='${region}',access_key='${access_key}',secret_key='${real_secret_key}' where resource_type='${resource_type}';`;
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
      // availability_zone: request.body.availability_zone,
    };
  } else if (resource_type === RESOURCE_TYPE.ALI) {
    newData = {
      instance_type: request.body.instance_type,
      instance_name: request.body.instance_name,
      // availability_zone: request.body.availability_zone,
      system_disk_category: request.body.system_disk_category,
      system_disk_name: request.body.system_disk_name,
      system_disk_description: request.body.system_disk_description,
      system_disk_size: request.body.system_disk_size,
      data_disk_category: request.body.data_disk_category,
      data_disk_name: request.body.data_disk_name,
      data_disk_description: request.body.data_disk_description,
      data_disk_size: request.body.data_disk_size,
      password: request.body.password,
      // status: request.body.status
    };
  } else if (resource_type === RESOURCE_TYPE.HUAWEI) {
    newData = {
      instance_type: request.body.instance_type,
      instance_name: request.body.instance_name,
      // availability_zone: request.body.availability_zone,
      image_name: request.body.image_name,
      system_disk_type: request.body.system_disk_type,
      system_disk_size: request.body.system_disk_size,
      data_disk_type: request.body.data_disk_type,
      data_disk_size: request.body.data_disk_size,
      password: request.body.password
    };
  }
  const key = generateUniqueId();
  const json_path = `${resource_type}-instance/${variable_file}`;
  await toJson(json_path, {
    availability_zone: request.body.availability_zone
  }, resource_type);
  const oldData = await updateResourceInfo(newData, resource_type, OPERATION_TYPE.ADD, key);
  // terraform apply --auto-approve -target 'module.aws_resources[\"l2iufnwg\"].aws_instance.instance'
  // const cmd = `${TERRAFORM_COMMANDS.APPLY} -target "module.${resource_type}_resources[\\"${key}\\"].${resource_type}_instance.instance"`;
  const cmd = TERRAFORM_COMMANDS.APPLY;
  const {
    code,
    cmd_info
  } = await execute(cmd, cmd_path);
  if (code === 0) {
    const res = {
      code,
      command_error: null,
      msg: '资源创建成功！'
    };
    response.send(JSON.stringify(res));
  } else {
    const res = {
      code,
      command_error: cmd_info,
      msg: '资源创建失败，原因请查看报错信息！'
    };
    response.send(JSON.stringify(res));
    revertJson(oldData, resource_type);
  }
});

app.post('/destroyResource', async (request, response) => {
  const {
    resource_type,
    instance_id
  } = request.body;
  let res = {};
  let oldData = null;
  const cmd_path = `${resource_type}-instance`;
  const {
    code: search_code,
    info
  } = await getInstanceInfo(resource_type, instance_id);
  if (search_code === 0) {
    // module.aws_resources[\"instance_a\"].aws_instance.instance
    const instance_key = info.instance_key;
    oldData = await updateResourceInfo(null, resource_type, OPERATION_TYPE.DELETE, instance_key);
    // const cmd = `${TERRAFORM_COMMANDS.DESTROY} -target "module.${resource_type}_resources[\\"${instance_key}\\"].${resource_type}_instance.instance" --auto-approve`;
    const cmd = TERRAFORM_COMMANDS.APPLY;
    const result = await execute(cmd, cmd_path);
    if (result.code === 0) {
      res = {
        code: 0,
        command_error: null,
        msg: '资源销毁成功！'
      };
      response.send(JSON.stringify(res));
      // oldData = await updateResourceInfo(null, resource_type, OPERATION_TYPE.DELETE, instance_key);
    } else {
      res = {
        code: 1,
        command_error: cmd_info,
        msg: '资源销毁失败，详情请查看报错信息！'
      };
      response.send(JSON.stringify(res));
    }
  } else {
    res = {
      code: 1,
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
    instance_key,
    modified_result
  } = request.body;
  const cmd_path = `${resource_type}-instance`;
  let res = {};
  const json_path = `${resource_type}-instance/${variable_file}`;
  await toJson(json_path, {
    availability_zone: modified_result.availability_zone
  }, resource_type);
  delete modified_result.availability_zone;
  const oldData = await updateResourceInfo(modified_result, resource_type, OPERATION_TYPE.MODIFY, instance_key);
  // const cmd = `${TERRAFORM_COMMANDS.APPLY} -target "module.${resource_type}_resources[\\"${instance_key}\\"].${resource_type}_instance.instance"`;
  const cmd = TERRAFORM_COMMANDS.APPLY;
  const {
    code,
    cmd_info
  } = await execute(cmd, cmd_path);
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
    revertJson(oldData, resource_type);
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
    const instance_info = json_data.values ? json_data.values.root_module.child_modules.filter(item => item.address.includes(`${resource_type}_resources`)).map(item => {
      if (resource_type === RESOURCE_TYPE.HUAWEI) {
        item.resources[2].values.public_ip = item.resources[1].values.public_ip;
      } else if (resource_type === RESOURCE_TYPE.ALI) {
        return item.resources[0];
      }
      return item.resources[2];
    }) : null;
    // const instance_info = null;
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

app.post('/showStaticProfile', (request, response) => {
  const {
    resource_type
  } = request.body;
  const select_sql = `select resource_type,access_key,secret_key,region from UserStaticProfile where resource_type='${resource_type}';`;
  let res = {};
  db.query(select_sql, function (err, result) {
    if (err) {
      res = {
        code: 1,
        command_error: err.message,
        msg: '静态资源信息查看失败，详情请查看报错信息！',
        result: null,
      }
    } else {
      const secret_key = encode(result[0].secret_key);
      result[0].secret_key = secret_key;
      res = {
        code: 0,
        command_error: null,
        msg: '静态资源信息查看成功！',
        result: result.length > 0 ? result[0] : null,
      }
    }
    response.send(JSON.stringify(res));
  })
})

app.post('/showRegion', (request, response) => {
  const {
    resource_type
  } = request.body;
  const select_sql = `select region from UserStaticProfile where resource_type='${resource_type}';`;
  let res = {};
  db.query(select_sql, function (err, result) {
    if (err) {
      res = {
        code: 1,
        command_error: err.message,
        msg: '静态资源信息查看失败，详情请查看报错信息！',
        result: null,
      }
    } else {
      res = {
        code: 0,
        command_error: null,
        msg: '静态资源信息查看成功！',
        result: result.length > 0 ? result[0] : null,
      }
    }
    response.send(JSON.stringify(res));
  })
})

// 命令行执行
function execute(cmd, working_path) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {
      cwd: working_path,
      maxBuffer: 2000 * 1024,
    }, function (error, stdout, stderr) {
      console.log(error);
      console.log(stdout);
      console.log(stderr);
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
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_input`
  const data = await fromJson(file);
  const oldData = data;
  Object.keys(newData).forEach(key => {
    data[type][key] = newData[key];
  });
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file, json_data);
  return oldData;
}

function revertJson(oldData, resource_type) {
  const file = `${resource_type}-instance/${variable_file}`;
  const json_data = JSON.stringify(oldData, null, "\t");
  fs.writeFileSync(file, json_data);
}

async function updateResourceInfo(newData, resource_type, operation_type, instance_key) {
  // newData的数据结构：key value：修改后的值
  const type = `${resource_type}_input`
  const file_path = `${resource_type}-instance/${variable_file}`;
  const data = await fromJson(file_path);
  const oldData = data;
  if (operation_type === OPERATION_TYPE.ADD) {
    data[type].list_result[instance_key] = {};
    Object.keys(newData).forEach(key => {
      data[type].list_result[instance_key][key] = newData[key];
    });
  } else if (operation_type === OPERATION_TYPE.MODIFY) {
    Object.keys(newData).forEach(key => {
      data[type].list_result[instance_key][key] = newData[key];
    });
  } else if (operation_type === OPERATION_TYPE.DELETE) {
    delete data[type].list_result[instance_key];
  }
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file_path, json_data);
  return oldData;
}

function generateUniqueId() {
  const uuid = Date.now().toString(36);
  return uuid;
}

function getInstanceKey(item) {
  // module.aws_resources[\"instance_a\"].aws_instance.instance
  const arr = item.split('"');
  return arr[1];
}

async function getInstanceInfo(resource_type, instance_id) {
  const cmd_path = `${resource_type}-instance`;
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.SHOW_RESOURCES_INFO, cmd_path);
  if (code === 0) {
    const json_data = JSON.parse(cmd_info);
    const instance_info = json_data.values.root_module ? json_data.values.root_module.child_modules.filter(item => item.address.includes(`${resource_type}_resources`)).map(item => {
      if (resource_type === RESOURCE_TYPE.HUAWEI) {
        item.resources[2].values.public_ip = item.resources[1].values.public_ip;
        return item.resources[2];
      } else if (resource_type === RESOURCE_TYPE.ALI) {
        return item.resources[0];
      } else {
        return item.resources[2]
      };
    }) : [];
    let res = {
      code: 2,
      info: "该资源尚未创建！"
    };
    instance_info.forEach(item => {
      if (item && item.values.id === instance_id) {
        const key = getInstanceKey(item.address);
        res = {
          code,
          info: {
            instance_key: key,
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

app.post('/vpcGroup', async function (request, response) {
  const {
    resource_type
  } = request.body;
  const cmd_path = `${resource_type}-instance`;
  const {
    code,
    cmd_info
  } = await execute(TERRAFORM_COMMANDS.SHOW_RESOURCES_INFO, cmd_path);
  let res;
  if (code === 0) {
    const json_data = JSON.parse(cmd_info);
    let result = null;
    const group = json_data.values.root_module ? json_data.values.root_module.child_modules.filter(item => item.address.includes(`${resource_type}_vpc`)) : null;
    if (group) {
      result = getVPCGroupInfo(resource_type, group[0].resources);
    }
    res = {
      code,
      command_error: null,
      msg: 'VPC资源组信息查看成功！',
      result,
    };
    response.send(JSON.stringify(res));
  } else {
    res = {
      code,
      command_error: cmd_info,
      msg: 'VPC资源组信息查看失败！',
      result,
    };
    response.send(JSON.stringify(res));
  }
});

const VPC_GROUP_RESOURCE = {
  VPC: 'vpc',
  SUBNET: 'subnet',
  SEC_GROUP: 'security_group',
  SEC_GROUP_RULE: 'security_group_rule',
  VSWITCH: 'vswitch',
  HUAWEI_SUBNET: 'huaweicloud_vpc_subnet',
  HUAWEI_VPC: 'huaweicloud_vpc',
  HUAWEI_SEC_GROUP: 'huaweicloud_networking_secgroup',
}

function getVPCGroupInfo(resource_type, group) {
  let result = {};
  if (resource_type === RESOURCE_TYPE.AWS) {
    group.forEach(item => {
      if (item.type.includes(VPC_GROUP_RESOURCE.SEC_GROUP)) {
        result[VPC_GROUP_RESOURCE.SEC_GROUP] = {};
        result[VPC_GROUP_RESOURCE.SEC_GROUP].id = item.values.id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].name = item.values.name;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].vpc_id = item.values.vpc_id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].ingress = {
          cidr_blocks: item.values.ingress[0].cidr_blocks,
          protocol: item.values.ingress[0].protocol,
          from_port: item.values.ingress[0].from_port,
          to_port: item.values.ingress[0].to_port,
        };
        result[VPC_GROUP_RESOURCE.SEC_GROUP].egress = {
          cidr_blocks: item.values.egress[0].cidr_blocks,
          protocol: item.values.egress[0].protocol,
          from_port: item.values.egress[0].from_port,
          to_port: item.values.egress[0].to_port,
        };
      } else if (item.type.includes(VPC_GROUP_RESOURCE.SUBNET)) {
        result[VPC_GROUP_RESOURCE.SUBNET] = {};
        result[VPC_GROUP_RESOURCE.SUBNET].id = item.values.id;
        result[VPC_GROUP_RESOURCE.SUBNET].availability_zone = item.values.availability_zone;
        result[VPC_GROUP_RESOURCE.SUBNET].cidr_blocks = item.values.cidr_block;
        result[VPC_GROUP_RESOURCE.SUBNET].name = item.values.tags.Name;
        result[VPC_GROUP_RESOURCE.SUBNET].vpc_id = item.values.vpc_id;
      } else if (item.type.includes(VPC_GROUP_RESOURCE.VPC)) {
        result[VPC_GROUP_RESOURCE.VPC] = {};
        result[VPC_GROUP_RESOURCE.VPC].id = item.values.id;
        result[VPC_GROUP_RESOURCE.VPC].name = item.values.tags.Name;
        result[VPC_GROUP_RESOURCE.VPC].cidr_blocks = item.values.cidr_block;
      }
    })
  } else if (resource_type === RESOURCE_TYPE.ALI) {
    group.forEach(item => {
      if (item.type === `${resource_type}cloud_${VPC_GROUP_RESOURCE.SEC_GROUP}`) {
        result[VPC_GROUP_RESOURCE.SEC_GROUP] = {};
        result[VPC_GROUP_RESOURCE.SEC_GROUP].id = item.values.id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].name = item.values.name;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].vpc_id = item.values.vpc_id;
      } else if (item.type === `${resource_type}cloud_${VPC_GROUP_RESOURCE.SEC_GROUP_RULE}`) {
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE] = {};
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].id = item.values.id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].cidr_ip = item.values.cidr_ip;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].ip_protocol = item.values.ip_protocol;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].policy = item.values.policy;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].port_range = item.values.port_range;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].security_group_id = item.values.security_group_id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE].type = item.values.type;
      } else if (item.type === `${resource_type}cloud_${VPC_GROUP_RESOURCE.VPC}`) {
        result[VPC_GROUP_RESOURCE.VPC] = {};
        result[VPC_GROUP_RESOURCE.VPC].id = item.values.id;
        result[VPC_GROUP_RESOURCE.VPC].name = item.values.name;
        result[VPC_GROUP_RESOURCE.VPC].cidr_block = item.values.cidr_block;
        result[VPC_GROUP_RESOURCE.VPC].status = item.values.status;

      } else if (item.type === `${resource_type}cloud_${VPC_GROUP_RESOURCE.VSWITCH}`) {
        result[VPC_GROUP_RESOURCE.VSWITCH] = {};
        result[VPC_GROUP_RESOURCE.VSWITCH].id = item.values.id;
        result[VPC_GROUP_RESOURCE.VSWITCH].name = item.values.name;
        result[VPC_GROUP_RESOURCE.VSWITCH].availability_zone = item.values.availability_zone;
        result[VPC_GROUP_RESOURCE.VSWITCH].vpc_id = item.values.vpc_id;
        result[VPC_GROUP_RESOURCE.VSWITCH].cidr_block = item.values.cidr_block;
        result[VPC_GROUP_RESOURCE.VSWITCH].status = item.values.status;
      }
    });
    if (result[VPC_GROUP_RESOURCE.SEC_GROUP] !== undefined) {
      result[VPC_GROUP_RESOURCE.SEC_GROUP].rules = {};
      result[VPC_GROUP_RESOURCE.SEC_GROUP].rules = result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE];
      delete result[VPC_GROUP_RESOURCE.SEC_GROUP_RULE];
    }
  } else if (resource_type === RESOURCE_TYPE.HUAWEI) {
    group.forEach(item => {
      if (item.type === VPC_GROUP_RESOURCE.HUAWEI_SUBNET && item.address.includes('data')) {
        result[VPC_GROUP_RESOURCE.SUBNET] = {};
        result[VPC_GROUP_RESOURCE.SUBNET].subnet_id = item.values.subnet_id;
        result[VPC_GROUP_RESOURCE.SUBNET].region = item.values.region;
        result[VPC_GROUP_RESOURCE.SUBNET].availability_zone = item.values.availability_zone;
        result[VPC_GROUP_RESOURCE.SUBNET].cidr = item.values.cidr;
        result[VPC_GROUP_RESOURCE.SUBNET].name = item.values.name;
        result[VPC_GROUP_RESOURCE.SUBNET].vpc_id = item.values.vpc_id;
        result[VPC_GROUP_RESOURCE.SUBNET].gateway_ip = item.values.gateway_ip;
        result[VPC_GROUP_RESOURCE.SUBNET].status = item.values.status;
      } else if (item.type === VPC_GROUP_RESOURCE.HUAWEI_SEC_GROUP) {
        result[VPC_GROUP_RESOURCE.SEC_GROUP] = {};
        result[VPC_GROUP_RESOURCE.SEC_GROUP].id = item.values.id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].name = item.values.name;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].vpc_id = item.values.vpc_id;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].region = item.values.region;
        result[VPC_GROUP_RESOURCE.SEC_GROUP].rule = {
          direction: item.values.rules[0].direction,
          ethertype: item.values.rules[0].ethertype,
          port_range_max: item.values.rules[0].port_range_max,
          port_range_min: item.values.rules[0].port_range_min,
          ports: item.values.rules[0].ports,
          protocol: item.values.rules[0].protocol,
        };
      } else if (item.type === VPC_GROUP_RESOURCE.HUAWEI_VPC) {
        result[VPC_GROUP_RESOURCE.VPC] = {};
        result[VPC_GROUP_RESOURCE.VPC].id = item.values.id;
        result[VPC_GROUP_RESOURCE.VPC].cidr = item.values.cidr;
        result[VPC_GROUP_RESOURCE.VPC].name = item.values.name;
        result[VPC_GROUP_RESOURCE.VPC].region = item.values.region;
        result[VPC_GROUP_RESOURCE.VPC].status = item.values.status;
      }
    });
  }
  return result;
}

app.listen(8000, () => {
  console.log("listening 8000……");
});