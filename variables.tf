variable "ali_props" {
  type = map(object({
    access_key     = string
    secret_key     = string
    region         = string
    instance_count = number
    instance_type  = list(string)
  }))
  # access_key
  # secret_key
  # region
  # instance_type this is a list
  # instance_count
}

variable "aws_props" {
  type = map(any)
}

variable "huawei_props" {
  type = map(any)
}
