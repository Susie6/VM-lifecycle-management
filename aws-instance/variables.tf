variable "aws_props" {
  type = object({
    access_key     = string
    secret_key     = string
    region         = string
    instance_count = number
    instance_type  = list(string)
    instance_name  = list(string)
    ami_id         = list(string)
  })
  default = {
    access_key     = "test"
    secret_key     = "test"
    region         = "us-east-1"
    instance_count = 0
    instance_type  = ["t2.micro"]
    instance_name  = ["my-first-aws"]
    ami_id         = ["ami-4ae27e22"]
  }
}
