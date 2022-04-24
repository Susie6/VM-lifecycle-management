export enum CloudType {
  AWS = 'aws',
  ALI = 'ali',
  HUAWEI = 'huawei',
}

export enum MenuSubItemType {
  Other = '其他资源',
  Instance = '虚拟机',
}

export enum InstanceStatus {
  Running = 'Running',
  Stopped = 'Stopped',
  Terminated = 'Terminated',
}

export enum StatusBadge {
  Running = 'success',
  Stopped = 'warning',
  Terminated = 'error',
}

export const StatusMap = {
  [InstanceStatus.Running]: StatusBadge.Running,
  [InstanceStatus.Stopped]: StatusBadge.Stopped,
  [InstanceStatus.Terminated]: StatusBadge.Terminated,
}

export enum AwsRegion {
  // 待确认
  Beijing = 'cn-beijing',
}

export enum AliRegion {
  // cn-shanghai cn-shenzhen cn-beijing cn-hangzhou cn-zhangjiakou cn-qingdao
  ShangHai = 'cn-shanghai',
  ShenZhen = 'cn-shenzhen',
  BeiJing = 'cn-beijing',
  HangZhou = 'cn-hangzhou',
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
  [HuaweiRegion.ShangHai2]: ['cn-east-2a', 'cn-east-2b', 'cn-east-2c', 'cn-east-2d'],
  [HuaweiRegion.ShangHai3]: ['cn-east-3a', 'cn-east-3b', 'cn-east-3c',],
  [HuaweiRegion.GuangZhou1]: ['cn-south-1a', 'cn-south-1b', 'cn-south-1c', 'cn-south-1e', 'cn-south-1f'],
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
  // s7.small.1 s7.medium.2 s7.xlarge.2 s7.2xlarge.2 s7.medium.4 s7.large.4 s7.xlarge.4 s7.2xlarge.4
  S7_SMALL = 's7.small.1', // 1 1
  S7_MEDIUM = 's7.medium.2', // 1 2
  S7_Large = 's7.large.2', // 2 4
  S6_SMALL = 's6.small.1', // 1 1
  S6_MEDIUM = 's6.medium.2', // 1 2
  S6_Large = 's6.large.2', // 2 4
}

export enum DrawerType {
  ADD = 'add',
  EDIT = 'edit',
}
