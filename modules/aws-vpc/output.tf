output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "subnet_id" {
  value = aws_subnet.a_public.id
}

output "secgroup_id" {
  value = aws_security_group.aws_sec_group.id
}
