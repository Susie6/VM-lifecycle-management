variable "instance_type" {
  type    = string
  default = "t2.micro"
  # https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/WindowsGuide/general-purpose-instances.html
}

variable "instance_name" {}

variable "subnet_id" {}

variable "secgroup_id" {}

variable "ami_id" {
  type = string
}