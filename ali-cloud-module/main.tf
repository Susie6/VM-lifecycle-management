terraform {
  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "1.162.0"
    }
  }
}

provider "alicloud" {
  # Configuration options
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region
}

data "alicloud_instance_types" "instance_info" { 
  cpu_core_count = var.cpu_core_count
  memory_size    = var.memory_size
}

resource "alicloud_vpc" "vpc" {
  name       = "alicloud__vpc_default"
  cidr_block = "172.16.0.0/12"
}

resource "alicloud_vswitch" "vsw" {
  vpc_id            = alicloud_vpc.vpc.id
  cidr_block        = "172.16.0.0/21"
  availability_zone = "cn-beijing-b"
}

# Create security group
resource "alicloud_security_group" "default" {
  name        = "alicloud_security_group_default"
  description = "default"
  vpc_id      = alicloud_vpc.vpc.id
}

resource "alicloud_security_group_rule" "allow_all_tcp" {
  type              = "ingress"
  ip_protocol       = "tcp"
  nic_type          = "intranet"
  policy            = "accept"
  port_range        = "1/65535"
  priority          = 1
  security_group_id = alicloud_security_group.default.id
  cidr_ip           = "0.0.0.0/0"
}

//https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/instance
resource "alicloud_instance" "instance" {
  # cn-beijing
  availability_zone       = "cn-beijing-b"
  security_groups         = [alicloud_security_group.group.id]
  instance_type           = var.instance_type
  image_id                = var.image_id
  status                  = var.status
  system_disk_category    = var.system_disk_category
  system_disk_name        = var.system_disk_name
  system_disk_description = var.system_disk_description
  system_disk_size        = var.system_disk_size
  vswitch_id              = alicloud_vswitch.vsw.id

  # instance_name              = "test_foo"
  tags = {
    Name = var.instance_name
  }
  data_disks {
    name        = var.data_disk_name
    size        = var.data_disk_size
    category    = var.data_disk_category
    description = var.data_disk_description
    encrypted   = true
  }
}
