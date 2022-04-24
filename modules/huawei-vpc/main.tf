data "huaweicloud_vpc_subnet" "mynet" {
  id = var.subnet_id
}

resource "huaweicloud_vpc" "vpc" {
  name = "huawei_vpc_default"
  cidr = "192.168.0.0/16"
}

// https://support.huaweicloud.com/usermanual-terraform/terraform-usermanual.pdf
resource "huaweicloud_vpc_subnet" "subnet" {
  name       = "huawei_subnet_default"
  cidr       = "192.168.10.0/24"
  gateway_ip = "192.168.10.1"
  vpc_id     = huaweicloud_vpc.vpc.id
}

resource "huaweicloud_networking_secgroup" "secgroup" {
  name                 = "huawei_secgroup_default"
  description          = "huawei cloud security group"
  delete_default_rules = true
}
resource "huaweicloud_networking_secgroup_rule" "secgroup_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 22
  port_range_max    = 22
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = huaweicloud_networking_secgroup.secgroup.id
}
