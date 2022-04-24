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

resource "aws_security_group" "aws_sec_group" {
  name   = "aws_security_group_default"
  vpc_id = aws_vpc.vpc.id

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
