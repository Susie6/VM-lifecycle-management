variable "aws_input" {
  type = object({
    access_key = string
    secret_key = string
    region     = string
    list_result = map(object({
      instance_type = string,
      instance_name = string,
      ami_id        = string
    }))
  })
}
