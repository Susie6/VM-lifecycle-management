terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region     = var.aws_input.region
  access_key = var.aws_input.access_key
  secret_key = var.aws_input.secret_key
}


module "aws_vpc" {
  source            = "../modules/aws-vpc"
  availability_zone = var.aws_input.availability_zone
}

module "aws_resources" {
  source   = "../modules/aws-cloud-module"
  for_each = var.aws_input.list_result

  instance_type     = each.value.instance_type
  instance_name     = each.value.instance_name
  ami_id            = each.value.ami_id
  availability_zone = var.aws_input.availability_zone

  subnet_id   = module.aws_vpc.subnet_id
  secgroup_id = module.aws_vpc.secgroup_id
}
