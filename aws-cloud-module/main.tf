terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  # Configuration options
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region
}

data "aws_ec2_instance_type" "ec2_type" {
  // 这个 type 还有什么其他的选项
  instance_type = var.instance_type
}

// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance
resource "aws_instance" "instance" {
  // amazon machine image
  ami                    = var.aws_ami_name
  instance_type          = var.instance_type
  cpu_core_count         = var.cpu_core_count
  private_ip             = var.private_ip #(Optional) Private IP address to associate with the instance in a VPC.
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.aws_sec_group.id]

  root_block_device {
    delete_on_termination = true
    iops                  = 150
    volume_size           = 50
    volume_type           = "gp2"
  }

  tags = {
    Name        = var.instance_name
  }
}

resource "aws_security_group" "aws_sec_group" {
  name   = "terraform-example-instance"
  vpc_id = var.vpc_id

  // To Allow SSH Transport
  ingress {
    from_port   = 22
    protocol    = "tcp"
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  // To Allow Port 80 Transport
  ingress {
    from_port   = 80
    protocol    = ""
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc" "vpc" {
  #定义ip块
  cidr_block = "172.16.16.0/21"
  #设置允许dns主机名
  enable_dns_hostnames = true
  #设置标签
  tags = {
    Name = "my aws vpc"
  }
}

#创建internet网关，别名test，并附加到VPC
resource "aws_internet_gateway" "test" {
  #绑定到vpc，${aws_vpc.test.id}为获取步骤2创建的vpc id
  vpc_id = aws_vpc.vpc.id
}

#创建子网，别名a_public
resource "aws_subnet" "a_public" {
  #指定所属的VPC
  vpc_id = aws_vpc.vpc.id
  #设置ip块
  cidr_block = "172.16.17.0/24"
  #设置可用区
  availability_zone = "ap-northeast-1a" // 这里需要学一下
  #设置标签
  tags = { Name = "M2M Tokyo POC Public-a" }
}

#创建路由表
resource "aws_route_table" "a_public" {
  #指定所属的VPC
  vpc_id = aws_vpc.vpc.id
  #绑定internet gateway，并绑定到0.0.0.0/0
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.test.id
  }
}

resource "aws_route_table" "a_private" {
  vpc_id = aws_vpc.vpc.id
}

#关联子网和路由表
resource "aws_route_table_association" "a_public" {
  #指定子网id
  subnet_id = aws_subnet.a_public.id
  #指定路由表id
  route_table_id = aws_route_table.a_public.id
}

