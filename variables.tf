variable "ali_props" {
  type = object({
    access_key              = string
    secret_key              = string
    region                  = string # cn-shanghai cn-shenzhen cn-beijing cn-hangzhou cn-zhangjiakou cn-qingdao
    instance_count          = number
    instance_type           = list(string)
    instance_name           = list(string)
    system_disk_category    = list(string)
    system_disk_name        = list(string)
    system_disk_description = list(string)
    system_disk_size        = list(number)
    data_disk_category      = list(string)
    data_disk_name          = list(string)
    data_disk_size          = list(number)
    data_disk_description   = list(string)
    status                  = list(string)
    # image_id     = string
  })
  default = {
    access_key              = "test"
    secret_key              = "test"
    region                  = "cn-shenzhen"
    instance_count          = 0
    instance_type           = ["ecs.n4.small"]
    instance_name           = ["my-first-ali"]
    system_disk_category    = ["cloud_efficiency"] # ephemeral_ssd, cloud_efficiency, cloud_ssd, cloud_essd, cloud
    system_disk_name        = ["alicloud_system_disk"]
    system_disk_description = ["alicloud_system_disk_description"]
    system_disk_size        = [20] # [20, 500]
    data_disk_category      = ["cloud_efficiency"]
    data_disk_name          = ["alicloud_data_disk"]
    data_disk_size          = [20]
    data_disk_description   = ["alicloud_data_disk_description"]
    status                  = ["Running"]
    # image_id     = "ami-0dd97ebb907cf9366"
  }
}

variable "aws_props" {
  type = object({
    access_key     = string
    secret_key     = string
    region         = string
    instance_count = number
    instance_type  = list(string)
    instance_name  = list(string)
    cpu_core_count = list(number)
    # aws_ami_id     = string
  })
  default = {
    access_key     = "test"
    secret_key     = "test"
    region         = "ap-northeast-2"
    instance_count = 0
    instance_type  = ["t2.micro"]
    instance_name  = ["my-first-aws"]
    cpu_core_count = [1]
    # aws_ami_id     = "ami-0dd97ebb907cf9366"
  }
}

variable "huawei_props" {
  type = object({
    access_key        = string
    secret_key        = string
    region            = string # cn-shanghai cn-shenzhen cn-beijing cn-hangzhou cn-zhangjiakou cn-qingdao
    availability_zone = string
    instance_count    = number
    instance_type     = list(string)
    instance_name     = list(string)
    system_disk_type  = list(string)
    system_disk_size  = list(number)
    data_disk_type    = list(string)
    data_disk_size    = list(number)
    image_name        = list(string)
  })
  default = {
    access_key        = "test"
    secret_key        = "test"
    region            = "cn-beijing"
    availability_zone = "cn-beijing-b"
    instance_count    = 0
    instance_type     = ["ecs.n4.small"]
    instance_name     = ["my-first-huawei"]
    system_disk_type  = ["SSD"]
    system_disk_size  = [20] # [1024]
    data_disk_type    = ["SSD"]
    data_disk_size    = [40]
    image_name        = ["Ubuntu 18.04 server 64bit"]
  }
}
