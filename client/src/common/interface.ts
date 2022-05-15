import { InstanceStatus, AwsInstanceType, AwsRegion, AliRegion, HuaweiRegion, HuaweiInstanceType, HuaweiImageName, HuaweiSystemDiskType, HuaweiDataDiskType, DiskCategory, AliInstanceType } from './enum';
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
  schema_version: string | number;
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
  instance_key: string;
  item: AwsResultItem;
}

export interface HuaweiResultItem {
  address: string;
  depends_on: string[];
  mode: string;
  name: string;
  provider_name: string;
  schema_version: number;
  sensitive_values: {
    block_device: [];
    data_disks: [];
    network: [];
    scheduler_hints: [];
    security_group_ids: [];
    security_groups: [];
    tags: any;
    volume_attached: [];
  }
  type: string;
  values: {
    access_ip_v4: string;
    access_ip_v6: string;
    admin_pass: string;
    agency_name: string;
    auto_pay: any;
    auto_renew: any;
    availability_zone: string;
    block_device: [];
    charging_mode: string;
    data_disks: {
      size: number;
      snapshot_id: string;
      type: HuaweiDataDiskType;
    }[];
    delete_disks_on_termination: any;
    enterprise_project_id: string | number;
    flavor_id: HuaweiInstanceType;
    flavor_name: string;
    id: string;
    image_id: string;
    image_name: HuaweiImageName;
    key_pair: any;
    metadata: any;
    name: string;
    network: HuaweiNetwork[];
    period: any;
    period_unit: any;
    power_action: any;
    public_ip: string | null;
    region: HuaweiRegion;
    scheduler_hints: [];
    security_group_ids: string[];
    security_groups: string[];
    status: string;
    stop_before_destroy: boolean;
    system_disk_id: string;
    system_disk_size: number;
    system_disk_type: HuaweiSystemDiskType;
    tags: { Name: string; }
    timeouts: any;
    user_data: any;
    user_id: any;
    volume_attached: HuaweiVolume[];
  }
}

export interface HuaweiResult {
  instance_key: string;
  item: HuaweiResultItem;
}

export interface HuaweiNetwork {
  access_network: boolean;
  fixed_ip_v4: string;
  fixed_ip_v6: string;
  ipv6_enable: boolean;
  mac: string;
  port: string;
  source_dest_check: boolean;
  uuid: string;
}

export interface HuaweiVolume {
  boot_index: number;
  pci_address: string;
  size: number;
  type: HuaweiSystemDiskType | HuaweiDataDiskType;
  volume_id: string;
}

export interface AliResultItem {
  address: string;
  depends_on: string[];
  mode: string;
  name: string;
  provider_name: string;
  schema_version: number;
  sensitive_values: {
    secondary_private_ips: [];
    data_disks: [];
    security_groups: [];
    tags: any;
    volume_tags: [];
  }
  type: string;
  values: {
    allocate_public_ip: any;
    auto_release_time: string;
    auto_renew_period: any;
    availability_zone: string;
    credit_specification: string;
    data_disks: {
      auto_snapshot_policy_id: string;
      category: DiskCategory;
      delete_with_instance: boolean;
      description: string;
      encrypted: boolean;
      kms_key_id: string;
      name: string;
      performance_level: string;
      size: number;
      snapshot_id: string;
    }[];
    deletion_protection: boolean;
    deployment_set_group_no: any;
    deployment_set_id: string;
    description: string;
    dry_run: boolean;
    force_delete: any;
    host_name: string;
    hpc_cluster_id: string;
    id: string;
    image_id: string;
    include_data_disks: any;
    instance_charge_type: string;
    instance_name: string;
    instance_type: AliInstanceType;
    internet_charge_type: string;
    internet_max_bandwidth_in: number;
    internet_max_bandwidth_out: number;
    io_optimized: any;
    is_outdated: any;
    key_name: string;
    kms_encrypted_password: any;
    kms_encryption_context: any;
    operator_type: any;
    password: string;
    period: any;
    period_unit: any;
    private_ip: string;
    public_ip: string;
    renewal_status: any;
    resource_group_id: string;
    role_name: string;
    secondary_private_ip_address_count: number;
    secondary_private_ips: [];
    security_enhancement_strategy: any;
    security_groups: string[];
    spot_price_limit: number;
    spot_strategy: string;
    status: InstanceStatus;
    subnet_id: string;
    system_disk_auto_snapshot_policy_id: string;
    system_disk_category: DiskCategory;
    system_disk_description: string;
    system_disk_name: string;
    system_disk_performance_level: string;
    system_disk_size: number;
    tags: { Name: string; }
    timeouts: any;
    user_data: string;
    volume_tags: { Name: string; }
    vswitch_id: string;
  }
}

export interface AliResult {
  instance_key: string;
  item: AliResultItem;
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
  system_disk_size: number;
  data_disk_category: string;
  data_disk_name: string;
  data_disk_description: string;
  data_disk_size: number;
  password: string;
}

export interface HuaweiForm extends FormValue {
  image_name: string;
  system_disk_type: string;
  system_disk_size: number;
  data_disk_type: string;
  data_disk_size: number;
  password: string;
}