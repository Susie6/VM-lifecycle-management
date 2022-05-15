terraform {
  required_providers {
    alicloud = {
      source  = "local-registry/aliyun/alicloud"
      version = "1.164.0"
    }
  }
}

data "alicloud_zones" "default" {
  available_disk_category     = "cloud_efficiency"
  available_resource_creation = "VSwitch"
}

resource "alicloud_vpc" "vpc" {
  vpc_name       = "alicloud_vpc_default"
  cidr_block = "172.16.0.0/16"
  lifecycle {
    create_before_destroy = false
  }
}

resource "alicloud_vswitch" "vsw" {
  vswitch_name = "alicloud_vswitch_default"
  vpc_id       = alicloud_vpc.vpc.id
  cidr_block   = "172.16.0.0/24"
  zone_id      = var.availability_zone
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
