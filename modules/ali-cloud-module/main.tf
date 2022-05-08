data "alicloud_images" "images_ds" {
  owners     = "system"
  name_regex = "^centos_7"
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
