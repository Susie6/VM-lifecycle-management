resource "aws_vpc" "vpc" {
  #定义ip块
  cidr_block = "172.16.16.0/21"
  #设置允许dns主机名
  enable_dns_hostnames = true
  #设置标签
  tags = {
    Name = "my aws vpc"
  }
  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_security_group" "aws_sec_group" {
  name   = "aws_security_group_default"
  vpc_id = aws_vpc.vpc.id

  // To Allow SSH Transport
  ingress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks=["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks=["::/0"]
  }

  tags {
    Name = "allow_all_access"
  }

  lifecycle {
    create_before_destroy = false
  }
}

#创建internet网关，并附加到VPC
resource "aws_internet_gateway" "test" {
  vpc_id = aws_vpc.vpc.id
  lifecycle {
    create_before_destroy = false
  }
}

#创建子网，别名a_public
resource "aws_subnet" "a_public" {
  #指定所属的VPC
  vpc_id = aws_vpc.vpc.id
  #设置ip块
  cidr_block = "172.16.16.0/24"
  #设置标签
  tags = { Name = "subnet_default" }

  availability_zone = var.availability_zone
  lifecycle {
    create_before_destroy = false
  }
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
