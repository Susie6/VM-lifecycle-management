terraform {
  required_providers {
    alicloud = {
      source  = "local-registry/aliyun/alicloud"
      version = "1.164.0"
    }
  }
}

data "alicloud_images" "images_ds" {
  owners     = "system"
  status     = "Available"

}
//https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/instance
resource "alicloud_instance" "instance" {
  # cn-beijing
  availability_zone       = var.availability_zone
  security_groups         = [var.secgroup_id]
  instance_type           = var.instance_type
  image_id                = data.alicloud_images.images_ds.images.0.id
  system_disk_category    = var.system_disk_category
  system_disk_name        = var.system_disk_name
  system_disk_description = var.system_disk_description
  system_disk_size        = var.system_disk_size
  vswitch_id              = var.vswitch_id
  password                = var.password
  internet_max_bandwidth_out = 10

  # instance_name              = "test_foo"
  tags = {
    Name = var.instance_name
  }
  data_disks {
    name        = var.data_disk_name
    size        = var.data_disk_size
    category    = var.data_disk_category
    description = var.data_disk_description
  }
}

# resource "alicloud_eip" "eip" {
#   address_name = "test_eip"
# }

# resource "alicloud_eip_association" "default" {
#   allocation_id = alicloud_eip.eip.id
#   instance_id   = alicloud_instance.instance.id
# }

