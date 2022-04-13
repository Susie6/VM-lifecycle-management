module "ali_resources" {
  source = "./ali-cloud-module"
	# count = lookup(var.ali_props, "instance_count")
	access_key = lookup(var.ali_props, "access_key")
	secret_key = lookup(var.ali_props, "secret_key")
	region = lookup(var.ali_props, "region")

	instance_type = lookup(var.ali_props, "instance_type")[count.index]
}