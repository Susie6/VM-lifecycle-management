output "instance_id" {
  value = huaweicloud_compute_instance.instance.id
}

output "instance_public_ip" {
  value = huaweicloud_compute_instance.instance.public_ip
}

# output "huaweicloud_compute_flavors" {
#   value = huaweicloud_compute_flavors.myflavor.ids
# }
