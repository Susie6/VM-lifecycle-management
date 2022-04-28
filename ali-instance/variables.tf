variable "ali_input" {
  type = object({
    access_key = string
    secret_key = string
    region     = string
    list_result = map(object({
      instance_type           = string
      instance_name           = string
      system_disk_category    = string
      system_disk_name        = string
      system_disk_description = string
      system_disk_size        = number
      data_disk_category      = string
      data_disk_name          = string
      data_disk_size          = number
      data_disk_description   = string
    }))

  })
}
