// https://registry.terraform.io/providers/huaweicloud/huaweicloud/latest/docs/resources/compute_instance
terraform {
  required_providers {
    huaweicloud = {
      source  = "local-registry/huaweicloud/huaweicloud"
      version = "1.35.2"
    }
  }
}

data "huaweicloud_images_image" "myimage" {
  name        = var.image_name
  visibility  = "public"
  most_recent = true
}

# data "huaweicloud_compute_flavors" "myflavor" {
#   availability_zone = var.availability_zone
#   performance_type  = "normal"
#   cpu_core_count    = 1
#   memory_size       = 2
# }

resource "huaweicloud_compute_instance" "instance" {
  name      = var.instance_name
  image_id  = data.huaweicloud_images_image.myimage.id
  flavor_id = var.instance_type
  # flavor_id           = data.huaweicloud_compute_flavors.myflavor.ids[1]
  security_group_ids  = [var.secgroup_id]
  availability_zone   = var.availability_zone
  system_disk_type    = var.system_disk_type
  system_disk_size    = var.system_disk_size
  admin_pass          = var.password
  stop_before_destroy = true
  tags = {
    Name = var.instance_name
  }

  network {
    uuid = var.subnet_id #Specifies the network UUID to attach to the instance. Changing this creates a new instance.
  }

  data_disks {
    type = var.data_disk_type
    size = var.data_disk_size

  }
}

resource "huaweicloud_vpc_eip" "myeip" {
  publicip {
    type = "5_bgp"
  }
  bandwidth {
    name        = "test"
    size        = 8
    share_type  = "PER"
    charge_mode = "traffic"
  }
}

resource "huaweicloud_compute_eip_associate" "associated" {
  public_ip   = huaweicloud_vpc_eip.myeip.address
  instance_id = huaweicloud_compute_instance.instance.id
}
