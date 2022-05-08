variable "huawei_input" {
  type = object({
    access_key        = string
    secret_key        = string
    region            = string
    availability_zone = string
    list_result = map(object({
      instance_type    = string
      instance_name    = string
      system_disk_type = string
      system_disk_size = number
      data_disk_type   = string
      data_disk_size   = number
      image_name       = string
    }))
  })
}
