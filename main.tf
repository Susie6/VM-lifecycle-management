terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
    alicloud = {
      source  = "aliyun/alicloud"
      version = "1.162.0"
    }
    huaweicloud = {
      source  = "huaweicloud/huaweicloud"
      version = "~> 1.26.0"
    }
  }
}

provider "alicloud" {
  access_key = var.ali_props.access_key
  secret_key = var.ali_props.secret_key
  region     = var.ali_props.region
}

provider "aws" {
  access_key = var.aws_props.access_key
  secret_key = var.aws_props.secret_key
  region     = var.aws_props.region
  endpoints {
    apigateway     = "http://localhost:4566"
    apigatewayv2   = "http://localhost:4566"
    cloudformation = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    ec2            = "http://localhost:4566"
    es             = "http://localhost:4566"
    elasticache    = "http://localhost:4566"
    firehose       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    kinesis        = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    rds            = "http://localhost:4566"
    redshift       = "http://localhost:4566"
    route53        = "http://localhost:4566"
    s3             = "http://s3.localhost.localstack.cloud:4566"
    secretsmanager = "http://localhost:4566"
    ses            = "http://localhost:4566"
    sns            = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    ssm            = "http://localhost:4566"
    stepfunctions  = "http://localhost:4566"
    sts            = "http://localhost:4566"
  }
}

provider "huaweicloud" {
  access_key = var.huawei_props.access_key
  secret_key = var.huawei_props.secret_key
  region     = var.huawei_props.region
}

module "ali_vpc" {
  source = "./modules/ali-vpc"
}

module "huawei_vpc" {
  source = "./modules/huawei-vpc"
}

module "aws_vpc" {
  source = "./modules/aws-vpc"
}

module "ali_resources" {
  source     = "./modules/ali-cloud-module"
  count      = var.ali_props.instance_count
  access_key = var.ali_props.access_key
  secret_key = var.ali_props.secret_key
  region     = var.ali_props.region

  instance_type           = var.ali_props.instance_type[count.index]
  instance_name           = var.ali_props.instance_name[count.index]
  system_disk_category    = var.ali_props.system_disk_category[count.index]
  system_disk_name        = var.ali_props.system_disk_name[count.index]
  system_disk_description = var.ali_props.system_disk_description[count.index]
  system_disk_size        = var.ali_props.system_disk_size[count.index]
  data_disk_category      = var.ali_props.data_disk_category[count.index]
  data_disk_name          = var.ali_props.data_disk_name[count.index]
  data_disk_size          = var.ali_props.data_disk_size[count.index]
  data_disk_description   = var.ali_props.data_disk_description[count.index]
  status                  = var.ali_props.status[count.index]

  secgroup_id = module.ali_vpc.alicloud_security_group_id
  vswitch_id  = module.ali_vpc.alicloud_vswitch_id
}

module "aws_resources" {
  source = "./modules/aws-cloud-module"
  count  = var.aws_props.instance_count

  instance_type  = var.aws_props.instance_type[count.index]
  instance_name  = var.aws_props.instance_name[count.index]
  cpu_core_count = var.aws_props.cpu_core_count[count.index]
  # aws_ami_id     = var.aws_props.aws_ami_id

  subnet_id   = module.aws_vpc.subnet_id
  secgroup_id = module.aws_vpc.secgroup_id
}

module "huawei_resources" {
  source            = "./modules/huawei-cloud-module"
  count             = var.huawei_props.instance_count
  access_key        = var.huawei_props.access_key
  secret_key        = var.huawei_props.secret_key
  region            = var.huawei_props.region
  availability_zone = var.huawei_props.availability_zone

  instance_type    = var.huawei_props.instance_type[count.index]
  instance_name    = var.huawei_props.instance_name[count.index]
  system_disk_type = var.huawei_props.system_disk_type[count.index]
  system_disk_size = var.huawei_props.system_disk_size[count.index]
  data_disk_type   = var.huawei_props.data_disk_type[count.index]
  data_disk_size   = var.huawei_props.data_disk_size[count.index]
  image_name       = var.huawei_props.image_name[count.index]

  subnet_id   = module.huawei_vpc.subnet_id
  secgroup_id = module.huawei_vpc.secgroup_id
}
