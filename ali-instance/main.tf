terraform {
  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "1.166.0"
    }
  }
}

provider "alicloud" {
  access_key = var.ali_input.access_key
  secret_key = var.ali_input.secret_key
  region     = var.ali_input.region
}

module "ali_vpc" {
  source = "../modules/ali-vpc"
}

module "ali_resources" {
  source   = "../modules/ali-cloud-module"
  for_each = var.ali_input.list_result

  instance_type           = each.value.instance_type
  instance_name           = each.value.instance_name
  availability_zone       = var.ali_input.availability_zone
  system_disk_category    = each.value.system_disk_category
  system_disk_name        = each.value.system_disk_name
  system_disk_description = each.value.system_disk_description
  system_disk_size        = each.value.system_disk_size
  data_disk_category      = each.value.data_disk_category
  data_disk_name          = each.value.data_disk_name
  data_disk_size          = each.value.data_disk_size
  data_disk_description   = each.value.data_disk_description

  secgroup_id = module.ali_vpc.alicloud_security_group_id
  vswitch_id  = module.ali_vpc.alicloud_vswitch_id
}
