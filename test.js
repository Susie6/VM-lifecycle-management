const express = require('express');
const app = express();
app.post('/path', (request, response) => {
  response.send("hello");
});


const {
  exec
} = require('child_process');
const fs = require('fs');

function fromJson(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) return reject(error);
      const parse_data = JSON.parse(data.toString())
      return resolve(parse_data);
    });
  });
};

async function toJson(file, newData) {
  // resource_type: aws_props huawei_props ali_props
  // newData的数据结构：key value：修改后的值
  // const type = `${resource_type}_props`
  const data = await fromJson(file);
  console.log("before: ", data.aws_input.list_result);
  delete data.aws_input.list_result["instance_a"]
  console.log("after: ", data.aws_input.list_result)
  // Object.keys(newData).forEach(key => {
  //   data["aws_input"][key] = newData[key];
  // });
  const json_data = JSON.stringify(data, null, "\t");
  fs.writeFileSync(file, json_data);
  // console.log("写入文件")
}

toJson('test.json', {
  secret_key: "15gsgdsf"
});







function myTest(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, {
      maxBuffer: 1024 * 2000,
      cwd: 'aws-instance'
    }, function (err, stdout, stderr) {
      const code = 1;
      if (err) {
        // console.log("aws: ", err);
        resolve({
          code,
          err
        });
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
async function aaa() {
  const d = await tryTest();
  console.log("aaaaa: ", d);
}
// aaa()

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

// app.post('/register', (request, response) => {
//   const {
//     user_id,
//     password,
//     confirm_password
//   } = request;
//   const sql = `select user_id from UserInfo where user_id=${user_id}`;
//   db.query(sql, function (err, result) {
//     if (result) {
//       const data = {
//         code: 1,
//         msg: '该用户名已存在，请重新设置用户名'
//       };
//       let str = JSON.stringify(data);
//       response.send(str);
//     } else if (password !== confirm_password) {
//       const data = {
//         code: 1,
//         msg: '两次输入的密码不一致，请重新输入'
//       };
//       let str = JSON.stringify(data);
//       response.send(str);
//     } else {
//       const data = {
//         code: 0,
//         msg: '注册成功！'
//       };
//       let str = JSON.stringify(data);
//       response.send(str);
//     }
//   });
// });

// app.post('/login', (request, response) => {
//   const {
//     user_id,
//     user_password,
//   } = request;
//   const sql = `select user_id, user_password from UserInfo where user_id=${user_id}`;
//   db.query(sql, function (err, result, fields) {
//     if (result[0].user_id === user_id && result[0].user_password === user_password) {
//       const data = {
//         code: 0,
//         msg: '登录成功！'
//       };
//       let str = JSON.stringify(data);
//       response.send(str);
//     } else {
//       const data = {
//         code: 1,
//         msg: '登录失败，请检查用户名或者密码！'
//       };
//       let str = JSON.stringify(data);
//       response.send(str);
//     }
//   });
// });

const info = {
  "format_version": "1.0",
  "terraform_version": "1.1.7",
  "values": {
    "outputs": {
      "secgroup_id": {
        "sensitive": false,
        "value": "sg-2bf071b380bca0ecb"
      },
      "subnet_id": {
        "sensitive": false,
        "value": "subnet-d735d69b"
      },
      "vpc_id": {
        "sensitive": false,
        "value": "vpc-62f98947"
      }
    },
    "root_module": {
      "child_modules": [{
        "resources": [{
          "address": "module.aws_resources[0].aws_instance.instance",
          "mode": "managed",
          "type": "aws_instance",
          "name": "instance",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 1,
          "values": {
            "ami": "ami-005e54dee72cc1d00",
            "arn": "arn:aws:ec2:us-east-1:000000000000:instance/i-014456007a3382a43",
            "associate_public_ip_address": true,
            "availability_zone": "ap-northeast-1a",
            "capacity_reservation_specification": [],
            "cpu_core_count": 1,
            "cpu_threads_per_core": null,
            "credit_specification": [{
              "cpu_credits": "standard"
            }],
            "disable_api_termination": false,
            "ebs_block_device": [],
            "ebs_optimized": false,
            "enclave_options": [],
            "ephemeral_block_device": [],
            "get_password_data": false,
            "hibernation": null,
            "host_id": null,
            "iam_instance_profile": "",
            "id": "i-014456007a3382a43",
            "instance_initiated_shutdown_behavior": "",
            "instance_state": "running",
            "instance_type": "t2.micro",
            "ipv6_address_count": 0,
            "ipv6_addresses": [],
            "key_name": "None",
            "launch_template": [],
            "metadata_options": [],
            "monitoring": false,
            "network_interface": [],
            "outpost_arn": "",
            "password_data": "",
            "placement_group": "",
            "placement_partition_number": null,
            "primary_network_interface_id": "eni-8c39793c",
            "private_dns": "ip-172-16-17-4.ec2.internal",
            "private_ip": "172.16.17.4",
            "public_dns": "ec2-54-214-207-244.compute-1.amazonaws.com",
            "public_ip": "54.214.207.244",
            "root_block_device": [{
              "delete_on_termination": true,
              "device_name": "/dev/sda1",
              "encrypted": false,
              "iops": 0,
              "kms_key_id": "",
              "tags": {},
              "throughput": 0,
              "volume_id": "vol-ad708f7f",
              "volume_size": 8,
              "volume_type": "gp2"
            }],
            "secondary_private_ips": [],
            "security_groups": [],
            "source_dest_check": true,
            "subnet_id": "subnet-d735d69b",
            "tags": {
              "Name": "my-first-aws"
            },
            "tags_all": {
              "Name": "my-first-aws"
            },
            "tenancy": "default",
            "timeouts": null,
            "user_data": null,
            "user_data_base64": null,
            "volume_tags": null,
            "vpc_security_group_ids": ["sg-2bf071b380bca0ecb"]
          },
          "sensitive_values": {
            "capacity_reservation_specification": [],
            "credit_specification": [{}],
            "ebs_block_device": [],
            "enclave_options": [],
            "ephemeral_block_device": [],
            "ipv6_addresses": [],
            "launch_template": [],
            "metadata_options": [],
            "network_interface": [],
            "root_block_device": [{
              "tags": {}
            }],
            "secondary_private_ips": [],
            "security_groups": [],
            "tags": {},
            "tags_all": {},
            "vpc_security_group_ids": [false]
          },
          "depends_on": ["module.aws_vpc.aws_security_group.aws_sec_group", "module.aws_vpc.aws_subnet.a_public", "module.aws_vpc.aws_vpc.vpc"]
        }],
        "address": "module.aws_resources[0]"
      }, {
        "resources": [{
          "address": "module.aws_vpc.aws_internet_gateway.test",
          "mode": "managed",
          "type": "aws_internet_gateway",
          "name": "test",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 0,
          "values": {
            "arn": "arn:aws:ec2:us-east-1:000000000000:internet-gateway/igw-1dec8ac2",
            "id": "igw-1dec8ac2",
            "owner_id": "000000000000",
            "tags": null,
            "tags_all": {},
            "vpc_id": "vpc-62f98947"
          },
          "sensitive_values": {
            "tags_all": {}
          },
          "depends_on": ["module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_route_table.a_private",
          "mode": "managed",
          "type": "aws_route_table",
          "name": "a_private",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 0,
          "values": {
            "arn": "arn:aws:ec2:us-east-1:000000000000:route-table/rtb-35bf35d3",
            "id": "rtb-35bf35d3",
            "owner_id": "000000000000",
            "propagating_vgws": [],
            "route": [],
            "tags": null,
            "tags_all": {},
            "timeouts": null,
            "vpc_id": "vpc-62f98947"
          },
          "sensitive_values": {
            "propagating_vgws": [],
            "route": [],
            "tags_all": {}
          },
          "depends_on": ["module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_route_table.a_public",
          "mode": "managed",
          "type": "aws_route_table",
          "name": "a_public",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 0,
          "values": {
            "arn": "arn:aws:ec2:us-east-1:000000000000:route-table/rtb-43e4333f",
            "id": "rtb-43e4333f",
            "owner_id": "000000000000",
            "propagating_vgws": [],
            "route": [{
              "carrier_gateway_id": "",
              "cidr_block": "0.0.0.0/0",
              "destination_prefix_list_id": "",
              "egress_only_gateway_id": "",
              "gateway_id": "igw-1dec8ac2",
              "instance_id": "",
              "ipv6_cidr_block": "",
              "local_gateway_id": "",
              "nat_gateway_id": "",
              "network_interface_id": "",
              "transit_gateway_id": "",
              "vpc_endpoint_id": "",
              "vpc_peering_connection_id": ""
            }],
            "tags": null,
            "tags_all": {},
            "timeouts": null,
            "vpc_id": "vpc-62f98947"
          },
          "sensitive_values": {
            "propagating_vgws": [],
            "route": [{}],
            "tags_all": {}
          },
          "depends_on": ["module.aws_vpc.aws_internet_gateway.test", "module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_route_table_association.a_public",
          "mode": "managed",
          "type": "aws_route_table_association",
          "name": "a_public",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 0,
          "values": {
            "gateway_id": "",
            "id": "rtbassoc-dae6bf65",
            "route_table_id": "rtb-43e4333f",
            "subnet_id": "subnet-d735d69b"
          },
          "sensitive_values": {},
          "depends_on": ["module.aws_vpc.aws_internet_gateway.test", "module.aws_vpc.aws_route_table.a_public", "module.aws_vpc.aws_subnet.a_public", "module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_security_group.aws_sec_group",
          "mode": "managed",
          "type": "aws_security_group",
          "name": "aws_sec_group",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 1,
          "values": {
            "arn": "arn:aws:ec2:us-east-1:000000000000:security-group/sg-2bf071b380bca0ecb",
            "description": "Managed by Terraform",
            "egress": [{
              "cidr_blocks": ["0.0.0.0/0"],
              "description": "",
              "from_port": 0,
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "protocol": "-1",
              "security_groups": [],
              "self": false,
              "to_port": 0
            }],
            "id": "sg-2bf071b380bca0ecb",
            "ingress": [{
              "cidr_blocks": ["0.0.0.0/0"],
              "description": "",
              "from_port": 22,
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "protocol": "tcp",
              "security_groups": [],
              "self": false,
              "to_port": 22
            }, {
              "cidr_blocks": ["0.0.0.0/0"],
              "description": "",
              "from_port": 80,
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "protocol": "",
              "security_groups": [],
              "self": false,
              "to_port": 80
            }],
            "name": "aws_security_group_default",
            "name_prefix": "",
            "owner_id": "000000000000",
            "revoke_rules_on_delete": false,
            "tags": null,
            "tags_all": {},
            "timeouts": null,
            "vpc_id": "vpc-62f98947"
          },
          "sensitive_values": {
            "egress": [{
              "cidr_blocks": [false],
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "security_groups": []
            }],
            "ingress": [{
              "cidr_blocks": [false],
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "security_groups": []
            }, {
              "cidr_blocks": [false],
              "ipv6_cidr_blocks": [],
              "prefix_list_ids": [],
              "security_groups": []
            }],
            "tags_all": {}
          },
          "depends_on": ["module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_subnet.a_public",
          "mode": "managed",
          "type": "aws_subnet",
          "name": "a_public",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 1,
          "values": {
            "arn": "arn:aws:ec2:ap-northeast-1:000000000000:subnet/subnet-d735d69b",
            "assign_ipv6_address_on_creation": false,
            "availability_zone": "ap-northeast-1a",
            "availability_zone_id": "apne1-az4",
            "cidr_block": "172.16.17.0/24",
            "customer_owned_ipv4_pool": "",
            "enable_dns64": false,
            "enable_resource_name_dns_a_record_on_launch": false,
            "enable_resource_name_dns_aaaa_record_on_launch": false,
            "id": "subnet-d735d69b",
            "ipv6_cidr_block": "",
            "ipv6_cidr_block_association_id": "",
            "ipv6_native": false,
            "map_customer_owned_ip_on_launch": false,
            "map_public_ip_on_launch": true,
            "outpost_arn": "",
            "owner_id": "000000000000",
            "private_dns_hostname_type_on_launch": "",
            "tags": {
              "Name": "M2M Tokyo POC Public-a"
            },
            "tags_all": {
              "Name": "M2M Tokyo POC Public-a"
            },
            "timeouts": null,
            "vpc_id": "vpc-62f98947"
          },
          "sensitive_values": {
            "tags": {},
            "tags_all": {}
          },
          "depends_on": ["module.aws_vpc.aws_vpc.vpc"]
        }, {
          "address": "module.aws_vpc.aws_vpc.vpc",
          "mode": "managed",
          "type": "aws_vpc",
          "name": "vpc",
          "provider_name": "registry.terraform.io/hashicorp/aws",
          "schema_version": 1,
          "values": {
            "arn": "arn:aws:ec2:us-east-1:000000000000:vpc/vpc-62f98947",
            "assign_generated_ipv6_cidr_block": false,
            "cidr_block": "172.16.16.0/21",
            "default_network_acl_id": "acl-c583a0cb",
            "default_route_table_id": "rtb-59c93149",
            "default_security_group_id": "sg-f2c38c4b1bdc7e9af",
            "dhcp_options_id": "dopt-7a8b9c2d",
            "enable_classiclink": false,
            "enable_classiclink_dns_support": false,
            "enable_dns_hostnames": true,
            "enable_dns_support": true,
            "id": "vpc-62f98947",
            "instance_tenancy": "default",
            "ipv4_ipam_pool_id": null,
            "ipv4_netmask_length": null,
            "ipv6_association_id": "",
            "ipv6_cidr_block": "",
            "ipv6_cidr_block_network_border_group": "",
            "ipv6_ipam_pool_id": "",
            "ipv6_netmask_length": 0,
            "main_route_table_id": "rtb-59c93149",
            "owner_id": "000000000000",
            "tags": {
              "Name": "my aws vpc"
            },
            "tags_all": {
              "Name": "my aws vpc"
            }
          },
          "sensitive_values": {
            "tags": {},
            "tags_all": {}
          }
        }],
        "address": "module.aws_vpc"
      }]
    }
  }
};