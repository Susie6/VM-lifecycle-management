variable "instance_count" {
  type = number
}

variable "access_key" {
  type = string
}

variable "secret_key" {
  type = string
}

variable "region" {
  type = string
  default = "us-east-1"
}

variable "instance_type" {
  type = string
  default = "t2.micro"
  # https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/WindowsGuide/general-purpose-instances.html
}

variable server_port {
  type    = number
  default = 8080
}

variable "instance_name" {}

variable "cpu_core_count" {
  type    = number
  default = 1
  # 受 instance type 限制
}

variable "private_ip" {
  
}

variable "subnet_id" {
  
}

variable "aws_ami_name" {
  
}