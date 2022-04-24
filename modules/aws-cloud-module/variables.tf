variable "instance_type" {
  type = string
  default = "t2.micro"
  # https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/WindowsGuide/general-purpose-instances.html
}

variable "instance_name" {}

variable "cpu_core_count" {
  type    = number
  default = 1
  # 受 instance type 限制
}

# variable "private_ip" {
  
# }

variable "subnet_id" {}

variable "secgroup_id" {}

variable "aws_ami_id" {
  type = string
}