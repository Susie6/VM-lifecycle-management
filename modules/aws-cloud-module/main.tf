// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance
resource "aws_instance" "instance" {
  // amazon machine image
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.secgroup_id]
  ebs_optimized          = true

  tags = {
    Name = var.instance_name
  }

  # credit_specification {
  #   cpu_credits = "unlimited"
  # }
}
