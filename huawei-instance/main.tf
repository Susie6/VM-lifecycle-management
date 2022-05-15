terraform {
  required_providers {
    huaweicloud = {
      source  = "local-registry/huaweicloud/huaweicloud"
      version = "1.35.2"
    }
  }
}

provider "huaweicloud" {
  access_key = var.huawei_input.access_key
  secret_key = var.huawei_input.secret_key
  region     = var.huawei_input.region
}

module "huawei_vpc" {
  source = "../modules/huawei-vpc"
}

module "huawei_resources" {
  source = "../modules/huawei-cloud-module"
  for_each = var.huawei_input.list_result

  availability_zone = var.huawei_input.availability_zone
  instance_type     = each.value.instance_type
  instance_name     = each.value.instance_name
  system_disk_type  = each.value.system_disk_type
  system_disk_size  = each.value.system_disk_size
  data_disk_type    = each.value.data_disk_type
  data_disk_size    = each.value.data_disk_size
  image_name        = each.value.image_name
  password          = each.value.password

  subnet_id   = module.huawei_vpc.subnet_id
  secgroup_id = module.huawei_vpc.secgroup_id
}
