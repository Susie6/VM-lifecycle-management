export enum CloudType {
  AWS = 'aws',
  ALI = 'ali',
  HUAWEI = 'huawei',
}

export enum ResourceType {
  VPCGroup = 'vpc',
  Instance = 'instance',
}

export enum MenuSubItemType {
  Other = '其他资源',
  Instance = '虚拟机资源',
}

export enum InstanceStatus {
  Running = 'running',
  Stopped = 'stopped',
  Terminated = 'terminated',
  RunningX = 'Running',
  StoppedX = 'Stopped',
  TerminatedX = 'Terminated',
  Active = 'ACTIVE',
}

export enum StatusBadge {
  Running = 'success',
  Stopped = 'warning',
  Terminated = 'error',
}

export const StatusMap = {
  [InstanceStatus.Running]: StatusBadge.Running,
  [InstanceStatus.RunningX]: StatusBadge.Running,
  [InstanceStatus.Active]: StatusBadge.Running,
  [InstanceStatus.Stopped]: StatusBadge.Stopped,
  [InstanceStatus.StoppedX]: StatusBadge.Stopped,
  [InstanceStatus.Terminated]: StatusBadge.Terminated,
  [InstanceStatus.TerminatedX]: StatusBadge.Terminated,
}

export const StatsuText = {
  [InstanceStatus.Running]: '运行中',
  [InstanceStatus.RunningX]: '运行中',
  [InstanceStatus.Active]: '运行中',
  [InstanceStatus.Stopped]: '已停止',
  [InstanceStatus.StoppedX]: '已停止',
  [InstanceStatus.Terminated]: '已终止',
  [InstanceStatus.TerminatedX]: '已终止',
}

export enum VPCStatus {
  Available = 'Available',
  Active = 'ACTIVE',
  OK = 'OK'
}

export const VPCStatusText = {
  [VPCStatus.Available]: 'Available',
  [VPCStatus.Active]: 'Available',
  [VPCStatus.OK]: 'Available',
}

export enum AwsRegion {
  // 待确认
  East = 'us-east-1',
  East2 = 'us-east-2',
  West = 'us-west-1',
  West2 = 'us-west-2',
}

export const AwsAvailableZone = {
  [AwsRegion.East]: ['us-east-1a', 'us-east-1b'],
  [AwsRegion.East2]: ['us-east-2a', 'us-east-2b'],
  [AwsRegion.West]: ['us-west-1a', 'us-west-1b'],
  [AwsRegion.West2]: ['us-west-2a', 'us-west-2b'],
}

export enum AliRegion {
  // cn-shanghai cn-shenzhen cn-beijing cn-hangzhou cn-zhangjiakou cn-qingdao
  HangZhou = 'cn-hangzhou',
  ShangHai = 'cn-shanghai',
  ShenZhen = 'cn-shenzhen',
  BeiJing = 'cn-beijing',
  ZhangJiaKou = 'cn-zhangjiakou',
  QingDao = 'cn-qingdao',
}

export enum HuaweiRegion {
  // cn-north-4 cn-north-1 cn-east-2 cn-east-3 cn-south-1
  BeiJing1 = 'cn-north-1',
  BeiJing4 = 'cn-north-4',
  ShangHai2 = 'cn-east-2',
  ShangHai3 = 'cn-east-3',
  GuangZhou1 = 'cn-south-1',
}

export const HuaweiAvailableZone = {
  [HuaweiRegion.BeiJing1]: ['cn-north-1a', 'cn-north-1b', 'cn-north-1c'],
  [HuaweiRegion.BeiJing4]: ['cn-north-4a', 'cn-north-4b', 'cn-north-4c', 'cn-north-4g'],
  [HuaweiRegion.ShangHai2]: ['cn-hangzhou-g'],
  [HuaweiRegion.ShangHai3]: ['cn-east-3a', 'cn-east-3b', 'cn-east-3c',],
  [HuaweiRegion.GuangZhou1]: ['cn-south-1a', 'cn-south-1b', 'cn-south-1c', 'cn-south-1e', 'cn-south-1f'],
}

export const AliAvailableZone = { // 这里要改
  [AliRegion.BeiJing]: ['cn-north-1a', 'cn-north-1b', 'cn-north-1c'],
  [AliRegion.ShenZhen]: ['cn-north-4a', 'cn-north-4b', 'cn-north-4c', 'cn-north-4g'],
  [AliRegion.ShangHai]: ['cn-east-2a', 'cn-east-2b', 'cn-east-2c', 'cn-east-2d'],
  [AliRegion.HangZhou]: ['cn-east-3a', 'cn-east-3b', 'cn-east-3c',],
  [AliRegion.ZhangJiaKou]: ['cn-south-1a', 'cn-south-1b', 'cn-south-1c', 'cn-south-1e', 'cn-south-1f'],
  [AliRegion.QingDao]: ['cn-south-1a'],
}

export enum AwsInstanceType {
  // t2.micro
  T2_MICRO = 't2.micro', // CPU 1, 内存1
  T2_SMALL = 't2.small', // CPU 1, 内存2
  T2_MEDIUM = 't2.medium', // CPU 2, 内存4
  T2_LARGE = 't2.large', // CPU 2, 内存8
  T3_MICRO = 't3.micro', // CPU 1, 内存1
  T3_SMALL = 't3.small', // CPU 1, 内存2
  T3_MEDIUM = 't3.medium', // CPU 2, 内存4
  T3_LARGE = 't3.large', // CPU 2, 内存8
}

export enum AliInstanceType {
  // ecs.n4.large xlarge ecs.e4.small
  N4_SMALL = 'ecs.n4.small',
  N4_Large = 'ecs.n4.large',
  N4_XLarge = 'ecs.n4.xlarge',
  E4_SMALL = 'ecs.e4.small',
  E4_Large = 'ecs.e4.large',
  E4_XLarge = 'ecs.e4.xlarge',
}

export enum HuaweiInstanceType {
  S2_SMALL = 's2.small.1', // 1 1
  S2_MEDIUM = 's2.medium.2', // 1 2
  S2_Large = 's2.large.2', // 2 4
  S3_SMALL = 's3.small.1', // 1 1
  S3_MEDIUM = 's3.medium.2', // 1 2
  S3_Large = 's3.large.2', // 2 4
}

export enum HuaweiImageName {
  // option: "Ubuntu 16.04 server 64bit" "Ubuntu 18.04 server 64bit" "Ubuntu 20.04 server 64bit"
  // "CentOS 7.6 64bit"  6.5 6.8 - 6.10 7.2 - 8.2
  Ubuntu16 = "Ubuntu 16.04 server 64bit",
  Ubuntu18 = "Ubuntu 18.04 server 64bit",
  Ubuntu20 = "Ubuntu 20.04 server 64bit",
  CentOS72 = "CentOS 7.2 64bit",
  CentOS76 = "CentOS 7.6 64bit",
}

export enum DrawerType {
  ADD = 'add',
  EDIT = 'edit',
}

export enum DiskCategory {
  //ephemeral_ssd, cloud_efficiency, cloud_ssd, cloud_essd
  Cloud_Efficiency = 'cloud_efficiency',
  Ephemeral_Ssd = 'ephemeral_ssd',
  Cloud_Ssd = 'cloud_ssd',
  Cloud_Essd = 'cloud_essd',
}

export enum HuaweiSystemDiskType {
  // SAS GPSSD SSD ESSD
  SSD = 'SSD',
  GPSSD = 'GPSSD',
  SAS = 'SAS',
  ESSD = 'ESSD',
}

export enum HuaweiDataDiskType {
  // SAS GPSSD SSD
  SSD = 'SSD',
  GPSSD = 'GPSSD',
  SAS = 'SAS',
}