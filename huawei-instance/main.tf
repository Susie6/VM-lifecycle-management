terraform {
  required_providers {
    huaweicloud = {
      source  = "huaweicloud/huaweicloud"
      version = "~> 1.26.0"
    }
  }
}

provider "huaweicloud" {
  access_key = var.huawei_props.access_key
  secret_key = var.huawei_props.secret_key
  region     = var.huawei_props.region
}

module "huawei_vpc" {
  source = "../modules/huawei-vpc"
}

module "huawei_resources" {
  source            = "../modules/huawei-cloud-module"
  count             = var.huawei_props.instance_count
  access_key        = var.huawei_props.access_key
  secret_key        = var.huawei_props.secret_key
  region            = var.huawei_props.region
  availability_zone = var.huawei_props.availability_zone

  instance_type    = var.huawei_props.instance_type[count.index]
  instance_name    = var.huawei_props.instance_name[count.index]
  system_disk_type = var.huawei_props.system_disk_type[count.index]
  system_disk_size = var.huawei_props.system_disk_size[count.index]
  data_disk_type   = var.huawei_props.data_disk_type[count.index]
  data_disk_size   = var.huawei_props.data_disk_size[count.index]
  image_name       = var.huawei_props.image_name[count.index]

  subnet_id   = module.huawei_vpc.subnet_id
  secgroup_id = module.huawei_vpc.secgroup_id
}