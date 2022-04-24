output "alicloud_vswitch_id" {
  value = alicloud_vswitch.vsw.id
}

output "alicloud_security_group_id" {
  value = alicloud_security_group.default.id
}

output "alicloud_vpc_id" {
  value = alicloud_vpc.vpc.id
}