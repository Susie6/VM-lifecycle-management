output "vpc_id" {
  value = module.aws_vpc.vpc_id
}

output "subnet_id" {
  value = module.aws_vpc.subnet_id
}

output "secgroup_id" {
  value = module.aws_vpc.secgroup_id
}

# output "instance_ids" {
#   value = module.aws_resources.*.aws_instance.instance.id
# }