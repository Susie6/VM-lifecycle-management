terraform {
  required_providers {
    huaweicloud = {
      source  = "huaweicloud/huaweicloud"
      version = "~> 1.26.0"
    }
  }
}

# Configure the HuaweiCloud Provider
provider "huaweicloud" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

// https://registry.terraform.io/providers/huaweicloud/huaweicloud/latest/docs/resources/compute_instance

data "huaweicloud_vpc_subnet" "mynet" {
  id = var.subnet_id
}

data "huaweicloud_images_image" "myimage" {
  name        = var.image_name
  visibility  = "public"
  most_recent = true
}

resource "huaweicloud_compute_instance" "instance" {
  name                = var.instance_name
  image_id            = data.huaweicloud_images_image.myimage.id
  flavor_id           = var.instance_type
  security_group_ids  = [var.secgroup_id]
  availability_zone   = var.availability_zone
  system_disk_size    = var.system_disk_size
  stop_before_destroy = true
  tags = {
    Name = var.instance_name
  }

  network {
    uuid = data.huaweicloud_vpc_subnet.mynet.id #Specifies the network UUID to attach to the instance. Changing this creates a new instance.
  }

  data_disks {
    type = var.data_disk_type
    size = var.data_disk_size

  }
}
