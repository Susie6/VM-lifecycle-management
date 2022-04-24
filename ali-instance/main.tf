terraform {
  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "1.162.0"
    }
  }
}

provider "alicloud" {
  access_key = var.ali_props.access_key
  secret_key = var.ali_props.secret_key
  region     = var.ali_props.region
}

module "ali_vpc" {
  source = "../modules/ali-vpc"
}

module "ali_resources" {
  source     = "../modules/ali-cloud-module"
  count      = var.ali_props.instance_count
  access_key = var.ali_props.access_key
  secret_key = var.ali_props.secret_key
  region     = var.ali_props.region

  instance_type           = var.ali_props.instance_type[count.index]
  instance_name           = var.ali_props.instance_name[count.index]
  system_disk_category    = var.ali_props.system_disk_category[count.index]
  system_disk_name        = var.ali_props.system_disk_name[count.index]
  system_disk_description = var.ali_props.system_disk_description[count.index]
  system_disk_size        = var.ali_props.system_disk_size[count.index]
  data_disk_category      = var.ali_props.data_disk_category[count.index]
  data_disk_name          = var.ali_props.data_disk_name[count.index]
  data_disk_size          = var.ali_props.data_disk_size[count.index]
  data_disk_description   = var.ali_props.data_disk_description[count.index]
  status                  = var.ali_props.status[count.index]

  secgroup_id = module.ali_vpc.alicloud_security_group_id
  vswitch_id  = module.ali_vpc.alicloud_vswitch_id
}