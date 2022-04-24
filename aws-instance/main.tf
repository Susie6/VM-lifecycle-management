terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region     = var.aws_props.region
  access_key = var.aws_props.access_key
  secret_key = var.aws_props.secret_key

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


module "aws_vpc" {
  source = "../modules/aws-vpc"
}

module "aws_resources" {
  source = "../modules/aws-cloud-module"
  count  = var.aws_props.instance_count

  instance_type  = var.aws_props.instance_type[count.index]
  instance_name  = var.aws_props.instance_name[count.index]
  cpu_core_count = var.aws_props.cpu_core_count[count.index]
  aws_ami_id     = var.aws_props.aws_ami_id

  subnet_id   = module.aws_vpc.subnet_id
  secgroup_id = module.aws_vpc.secgroup_id
}
