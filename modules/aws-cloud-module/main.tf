// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance
resource "aws_instance" "instance" {
  // amazon machine image
  ami                         = var.ami_id
  instance_type               = var.instance_type
  availability_zone           = var.availability_zone
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.secgroup_id]
  associate_public_ip_address = true
  # ebs_optimized          = true

  tags = {
    Name = var.instance_name
  }

}

resource "aws_eip" "eip_resource" {
  vpc = true
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.instance.id
  allocation_id = aws_eip.eip_resource.id
}
