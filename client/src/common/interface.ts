import { InstanceStatus, AwsInstanceType, AwsRegion, AliRegion, HuaweiRegion } from './enum';
export interface BoxInfo {
  title: string;
  count: number;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  render?: (v: any) => any;
}

export interface ResponseData {
  code: number;
  command_error: any;
  msg: string;
  result?: any;
}

export interface AwsResultItem {
  address: string;
  depends_on: string[];
  mode: string;
  name: string;
  provider_name: string;
  schema_version: string;
  sensitive_values: {
    capacity_reservation_specification: [];
    credit_specification: [];
    ebs_block_device: [];
    enclave_options: [];
    ephemeral_block_device: [];
    ipv6_addresses: [];
    launch_template: [];
    metadata_options: [];
    network_interface: [];
    root_block_device: [];
    secondary_private_ips: [];
    security_groups: [];
    tags: {}
    tags_all: {}
    vpc_security_group_ids: [];
    type: string;
  }
  type: string;
  values: {
    ami: string;
    arn: string;
    associate_public_ip_address: boolean;
    availability_zone: string;
    capacity_reservation_specification: [];
    cpu_core_count: number;
    cpu_threads_per_core: string | number | null;
    credit_specification: { cpu_credits: string }[];
    disable_api_termination: boolean;
    ebs_block_device: [];
    ebs_optimized: boolean;
    enclave_options: [];
    ephemeral_block_device: [];
    get_password_data: boolean;
    hibernation: any;
    host_id: string | null;
    iam_instance_profile: string;
    id: string;
    instance_initiated_shutdown_behavior: string;
    instance_state: InstanceStatus;
    instance_type: AwsInstanceType;
    ipv6_address_count: number;
    ipv6_addresses: string[];
    key_name: string;
    launch_template: [];
    metadata_options: [];
    monitoring: boolean;
    network_interface: [];
    outpost_arn: string;
    password_data: string;
    placement_group: string;
    placement_partition_number: number | string | null;
    primary_network_interface_id: string;
    private_dns: string;
    private_ip: string;
    public_dns: string;
    public_ip: string;
    root_block_device: {
      delete_on_termination: boolean;
      device_name: string;
      encrypted: boolean;
      iops: number;
      kms_key_id: string;
      tags: any;
      throughput: number;
      volume_id: string;
      volume_size: number;
      volume_type: string;
    }[];
    secondary_private_ips: [];
    security_groups: [];
    source_dest_check: boolean;
    subnet_id: string;
    tags: { Name: string; }
    tags_all: { Name: string; }
    tenancy: string;
    timeouts: number | null;
    user_data: any;
    user_data_base64: any;
    volume_tags: any;
    vpc_security_group_ids: string[];
  }
}

export interface AwsResult {
  index: number;
  item: AwsResultItem;
}

export interface StaticProfileForm {
  access_key: string;
  secret_key: string;
  region: AwsRegion | AliRegion | HuaweiRegion;
}

interface FormValue {
  instance_type: string;
  instance_name: string;
  availability_zone: string;
}

export interface AwsForm extends FormValue {
  ami_id: string;
}


export interface AliForm extends FormValue {
  system_disk_category: string;
  system_disk_name: string;
  system_disk_description: string;
  system_disk_size: string;
  data_disk_category: string;
  data_disk_name: string;
  data_disk_description: string;
  data_disk_size: string;
}

export interface HuaweiForm extends FormValue {
  image_name: string;
  system_disk_type: string;
  system_disk_size: string;
  data_disk_type: string;
  data_disk_size: string;
}