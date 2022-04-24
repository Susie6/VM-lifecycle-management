output "secgroup_id" {
  value = huaweicloud_networking_secgroup.secgroup.id
}

output "vpc_id" {
  value = huaweicloud_vpc.vpc.id
}

output "subnet_id" {
  value = huaweicloud_vpc_subnet.subnet.id
}