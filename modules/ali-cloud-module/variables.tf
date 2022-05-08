variable "instance_type" {
  type    = string
  default = "ecs.n4.small"
  # ecs.n4.large xlarge ecs.e4.small
}

# variable "image_id" {
#   type = string
# }

variable "instance_name" {
  type = string
}

variable "system_disk_category" {
  default = "cloud_efficiency"
  // 可选值有 ephemeral_ssd, cloud_efficiency, cloud_ssd, cloud_essd, cloud
}

variable "system_disk_name" {
  default     = "alicloud_system_disk"
  description = "The name of the system disk. The name must be 2 to 128 characters in length and can contain letters, digits, periods (.), colons (:), underscores (_), and hyphens (-). It must start with a letter and cannot start with http:// or https://."
}

variable "system_disk_description" {
  default        = "alicloud_system_disk_description"
  description = "The description of the system disk. The description must be 2 to 256 characters in length and cannot start with http:// or https://."
}

variable "system_disk_size" {
  type        = number
  description = "Size of the system disk, measured in GiB. Value range: [20, 500]. The specified value must be equal to or greater than max{20, Imagesize}. Default value: max{40, ImageSize}."
}

variable "data_disk_name" {
  default = "alicloud_data_disk"
}

variable "data_disk_size" {
  type    = number
  default = 20
}

variable "data_disk_category" {

}

variable "data_disk_description" {
  default = "alicloud_data_disk_description"
}

variable "availability_zone" {
  # "cn-beijing-b"
}

variable "secgroup_id" {}

variable "vswitch_id" {}
