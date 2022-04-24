variable "aws_props" {
  type = object({
    access_key     = string
    secret_key     = string
    region         = string
    instance_count = number
    instance_type  = list(string)
    instance_name  = list(string)
    cpu_core_count = list(number)
    aws_ami_id     = string
  })
  default = {
    access_key     = "test"
    secret_key     = "test"
    region         = "us-east-1"
    instance_count = 0
    instance_type  = ["t2.micro"]
    instance_name  = ["my-first-aws"]
    cpu_core_count = [1]
    aws_ami_id     = "ami-4ae27e22"
  }
}