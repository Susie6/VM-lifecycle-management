# variable "access_key" {
#   type = string
# }

# variable "secret_key" {
#   type = string
# }

# variable "region" {
#   type = string
#   # https://developer.huaweicloud.com/endpoint
# }

variable "availability_zone" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "s7.small.1"
  # s7.small.1 s7.medium.2 s7.xlarge.2 s7.2xlarge.2 s7.medium.4 s7.large.4 s7.xlarge.4 s7.2xlarge.4
  # s6 sn3 s3
  # https://support.huaweicloud.com/productdesc-ecs/ecs_01_0019.html
}

variable "secgroup_id" {}

variable "subnet_id" {}

variable "instance_name" {
  type        = string
  description = "Specifies a unique name for the instance. The name consists of 1 to 64 characters, including letters, digits, underscores (_), hyphens (-), and periods (.)."
}

variable "system_disk_type" {
  type        = string
  default     = "SSD"
  description = "SAS GPSSD SSD ESSD"
}

variable "system_disk_size" {
  type        = number
  description = "Specifies the system disk size in GB, The value range is 1 to 1024. Shrinking the disk is not supported."
}

variable "data_disk_type" {
  type        = string
  default     = "SSD"
  description = "pecifies the ECS data disk type, which must be one of available disk types, contains of SSD, GPSSD and SAS. Changing this creates a new instance."
}

variable "data_disk_size" {
  type    = number
  default = 40
  # range 40 - 1024
}

# variable "cpu_core_count" {
#   type    = number
#   default = 2
# }

# variable "memory_size" {
#   type        = number
#   default     = 4
#   description = " Specifies the memory size(GB) in the ECS flavor."
# }

variable "image_name" {
  type = string
  default = "Ubuntu 18.04 server 64bit"
  # option: "Ubuntu 16.04 server 64bit" "Ubuntu 18.04 server 64bit" "Ubuntu 20.04 server 64bit"
  # "CentOS 7.6 64bit"  6.5 6.8 - 6.10 7.2 - 8.2
}
