SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET time_zone = "+00:00";
SET GLOBAL character_set_database=utf8;
SET GLOBAL character_set_server=utf8;
-- ----------------------------------------- Fact Tables --------------------------------------------
CREATE TABLE IF NOT EXISTS Organization (
  --  Basic information of a Organization.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  单位组织的id
  organization_code varchar(9),-- 单位组织机构代码
  organization_number varchar(20), -- 单位的树形结构标示码,用于查找所有的上级机构和所有的下级机构,目前共14位,依次为:
    -- 62甘肃,01交通厅,01公路局,01兰州公路局,01城关区公路段,01道班,01备用
  organization_name varchar(100),-- 单位名称
  organization_administrative_divisions int(6),-- 单位行政区划  需建立附表
  organization_description varchar(255), -- 单位职能描述
  name varchar(30),-- 单位法人姓名
  telephone varchar(18),  --  单位固定联系电话
  superior_organization_id bigint(10),-- 上级机构ID
  organization_kind int(1),  --  机构从属性质 （单位、部门、直属单位、临时机构等）
  sequence_number bigint, --  序号
  address varchar(255), --  单位办公地址
  organization_name_one varchar(100),-- 单位第二名称
  organization_name_two varchar(100), --  单位第三名称
  organization_abbreviation varchar(100),-- 单位常用简称
  organization_level int(1),-- 单位级别
  fax varchar(18),-- 单位传真
  email varchar(100),-- 单位电子邮箱
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime, -- 更新时间
  INDEX index_organization_number USING BTREE (organization_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table for User.
CREATE TABLE IF NOT EXISTS User (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  organization_id bigint NOT NULL,-- 所属机构ID
  login_name varchar(20) NOT NULL,-- 登录名
  real_name varchar(20),-- 真实用户名
  password varchar(200) NOT NULL,-- 密码
  gender boolean,-- 性别 0 男 1 女
  birthday date,-- 出生日期
  telephone varchar(18),-- 联系电话
  mobile varchar(18),-- 手机
  email varchar(50),-- 邮箱
  qq_code varchar(20),-- QQ号码
  weixin_code varchar(20),-- 微信号码
  login_allow boolean,-- 是否允许登录,1 是; 0 否
  pictures varchar(100),-- 照片
  create_user_id bigint(10),-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10),-- 更新人ID
  update_date datetime,-- 更新时间
  user_forbidden int(1) ,-- 删除用户
  openid varchar(100), -- 微信会话ID
  INDEX index_login_name USING BTREE (login_name),
  FOREIGN KEY (organization_id) REFERENCES Organization (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS Role(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  role_name varchar(50),-- 角色名称
  role_description varchar(200),-- 角色描述
  role_type int(1),-- 角色类型 0-路网中心 1～5五大局
  create_user_id bigint(10),-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10),-- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS UserRole(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  user_id bigint NOT NULL,-- 用户ID
  role_id bigint NOT NULL,-- 角色ID
  system_id int(2),-- 功能系统ID
  create_user_id bigint(10),-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10),-- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (user_id) REFERENCES User (id),
  FOREIGN KEY (role_id) REFERENCES Role (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS Authority (
  --  Basic information of Authority.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  权限的id
  role_id bigint(10),-- 角色ID
  authority_type int(1),-- 权限类型   1: 菜单权限   2: 数据库读写权限
  authority_domain varchar(200),-- 权限域
  authority_name varchar(50), -- 权限名称
  authority_value int(1),-- 权限值
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (role_id) REFERENCES Role (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS RoadInformation (
  -- Basic information of 公路信息.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 公路路线表id
  road_name varchar(50) NOT NULL,-- 线路名称
  road_code varchar(50) NOT NULL,-- 线路编号

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  INDEX index_road_name USING BTREE (road_name),
  INDEX index_road_code USING BTREE (road_code),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS RoadSegment(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  road_id bigint(10) NOT NULL,-- 公路线路ID
  area_code int(6),-- 所在行政区域代码
  road_mileage double,-- 里程数
  segment_start_name varchar(50),-- 路段起点名称
  segment_end_name varchar(50),-- 路段止点名称
  segment_start_pile double(7,3),-- 路段起点桩号
  segment_end_pile double(7,3),-- 路段止点桩号
  build_year year,-- 修建年度
  rebuild_year year,-- 改建年度
  latest_repair_year year,-- 最近一次大中修年度
  max_speed int(3),-- 设计时速
  to_plant_mileage double,-- 可绿化里程
  planted_mileage double,-- 已绿化里程
  technical_grade_code int(2),-- 技术等级代码
  technical_grade varchar(20),-- 技术等级
  is_discontinued boolean,-- 是否断头路段
  discontinuity_type int(1),-- 断链类型  *
  control_start_name varchar(50),-- 重要控制起点  *
  control_end_name varchar(50),-- 重要控制止点  *
  is_urban_managed boolean,-- 是否城管路段
  charge_type varchar(20),-- 路段收费性质
  province_connect int(2),-- 省际出入口
  is_highway boolean,-- 是否一幅高速
  lane_quantity int(2),-- 车道数量
  maintainance_mileage double,-- 养护里程
  landform_code int(2),-- 地貌代码
  landform varchar(20),-- 地貌汉字
  channel_quantity int(4),-- 涵洞数量
  base_width double,-- 路基宽度
  road_width double,-- 路面宽度
  surface_height double,-- 面层厚度
  create_user_id bigint(10),-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10),-- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS TollStation(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  organization_id bigint(10) NOT NULL,-- 单位ID
  road_id bigint(10) NOT NULL,-- 公路线路ID
  is_provincial_border boolean,-- 是否省界
  toll_properties varchar(100),-- 收费站收费性质
  entrance_lane_num int(2),-- 入口车道数
  entrance_lane_ETC_num int(2),-- 入口ETC车道数
  export_lane_num int(2),-- 出口车道数
  export_lane_ETC_num int(2),-- 出口ETC车道数
  back_up_lane int(2),-- 备用车道数
  static_scale int(2),-- 静态秤数量
  dynamic_scales int(2),-- 动态秤数量
  technical_grade int(2),-- 所在路线技术等级
  toll_station_type int(2),-- 收费站类型
  location_type int(2),-- 收费站位置类型
  entrance_wide_lane int(2),-- 入口超宽车道数
  export_wide_lane int(2),-- 出口超宽车道数
  charging_management_organization_name varchar(100),-- 收费管理机构名称
  administrative_unit varchar(100),-- 管理单位
  superior_management_unit varchar(100),-- 上级管理单位
  chargeable_periods varchar(100),-- 收费期限
  root_tollstation_id bigint(10),-- 新添收费站，之后修改此字段与之相同
  is_read boolean,-- 判断是否为最新数据 0-之前所有数据 1-最新修改数据
  location_pictures varchar(100),-- 现场照片
  longitude double,-- 经度
  altitude double,-- 纬度
  pile double(7,3),-- 收费站桩号
  create_user_id bigint(10),-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10),-- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS ServiceArea(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,-- ID
  organization_id bigint(10) NOT NULL,-- 单位ID
  road_id bigint(10) NOT NULL,-- 路线ID
  direction int(1),-- 上下行 1-上行 2-下行
  open_status int(1),-- 运行状态 1-开放 0-关闭
  remark varchar(200),-- 备注
  position_in_mileage double(7,3),-- 桩号 计量单位:千米（km）
  position varchar(20),-- 位置
  catering_services int(1),-- 餐饮服务 0-无 1-开放 2-关闭
  toilet int(1),-- 卫生间  0-无 1-开放 2-关闭
  hotel int(1),-- 住宿 0-无 1-开放 2-关闭
  connect_channel int(1),-- 两区连接通道 0-无 1-开放 2-关闭
  charging_pile int(1),-- 充电桩 0-无 1-开放 2-关闭
  gas_station int(1),-- 加气站 0-无 1-开放 2-关闭
  petrol_station int(1),-- 加油站 0-无 1-开放 2-关闭
  ninty_three_petrol int(1),-- 93＃ 0-无 1-开放 2-关闭
  ninty_seven_petrol int(1),-- 97＃ 0-无 1-开放 2-关闭
  ten_diesel int(1),-- 10＃柴油 0-无 1-开放 2-关闭
  zero_diesel int(1),-- 0＃柴油 0-无 1-开放 2-关闭
  minus_ten_diesel int(1),-- －10＃柴油 0-无 1-开放 2-关闭
  repair_services int(1),-- 车辆维修服务 0-无 1-开放 2-关闭
  super_market int(1),-- 超市 0-无 1-开放 2-关闭
  drink_water int(1),-- 饮用水 0-无 1-开放 2-关闭
  eighty_nine_petrol int(1),-- 89# 0-无 1-开放 2-关闭
  ninety_eight_petrol int(1),-- 98# 0-无 1-开放 2-关闭
  minus_twenty_diesel int(1),-- -20# 0-无 1-开放 2-关闭
  minus_thirtyfive_diesel int(1),-- -35# 0-无 1-开放 2-关闭
  minus_fifty_diesel int(1),-- -50# 0-无 1-开放 2-关闭
  liquefied_natural_gas int(1),-- 液化天然气 0-无 1-开放 2-关闭
  compressed_natural_gas int(1),-- 压缩天然气 0-无 1-开放 2-关闭
  abstract varchar(500),-- 服务区简介
  cart_parking_space int(4),-- 停车位数量(大车)
  dolly_parking_space int(4),-- 停车位数量(小车)
  root_services_id bigint(10),-- 新添收费站，之后修改此字段与之相同
  is_read boolean,-- 判断是否为最新数据 0-之前所有数据 1-最新修改数据
  create_user_id bigint(10) ,-- 创建人ID
  create_date datetime,-- 创建时间
  update_user_id bigint(10) ,-- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS Notice(
  --  Basic information of Message.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  通告信息的id
  message_title varchar(50),-- 信息标题
  message_content varchar(500),-- 信息内容
  send_target varchar(500),-- 信息发送范围
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS BlockingMessage (
  --  Basic information of BlockingMessage.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  预审核阻断信息的id
  organization_id bigint(10),-- 主管单位ID  foreign key 机构表ID
  road_id bigint(10) NOT NULL,-- 公路线路ID
  blocking_section_starting_position_in_mileage double(7,3),-- 阻断路段起点桩号 计量单位:千米（km）
  blocking_section_ending_position_in_mileage double(7,3),-- 阻断路段止点桩号 计量单位:千米（km）
  direction_of_blocking int(1),-- 阻断发生方向 (上行1,下行2,双向3)
  location_of_blocking varchar(100), -- 阻断地点名称 阻断(事件)位置
  blocking_time datetime,-- 阻断发生时间
  blocking_area varchar(100),-- 阻断发生区域 行政区划代码
  quantity_of_destroyed_vehicles int(6),-- 毁坏车辆数 （辆）
  quantity_of_the_stranded int(6),-- 滞留人员数 （人）
  congestion_length double,-- 拥堵长度 （公里）
  quantity_of_stranded_vehicles int(6),-- 滞留车辆数 （辆）
  road_administration_damage_amount_involved double,-- 路产损失 （万元）
  affected_province_code int(2),-- 受影响邻省编号 参见GB T2260-2013
  blocking_properties int(2),-- 阻断性质  分为自然突发和人为计划 0-人为计划 1-自然突发 (此字段作废)
  type_of_blocking_reason int(4),-- 阻断原因类型
  blocking_reason varchar(100),-- 阻断原因
  treatment_measures varchar(500),-- 处置措施
  traffic_opening_time datetime,-- 实际恢复通行时间
  emergency_condition varchar(30),-- 突发事件状态
  location_pictures varchar(100),-- 现场照片
  emergency_abstrat varchar(500),-- 事件摘要
  road_type int(2),-- 路况类型
  estimated_recovery_time datetime,-- 预计恢复时间
  emergency_description varchar(500),-- 现场情况描述
  injured_people int(6),-- 受伤人数 （人）
  death_people int(6),-- 死亡人数  （人）
  recovery_progress varchar(500),-- 恢复情况
  appendix_file varchar(500),-- 附件文件
  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布 3-待复审
  direction_of_blocking_description varchar(500),-- 阻断方向说明
  push_information  varchar(2000), -- 推送信息
  initial_emergency_id bigint(10),-- 初报ID
  initial_emergency_code int(1) DEFAULT 0,-- 初报标志位 0-初报事件 1-续报事件
  reroute_scheme varchar(500),-- 绕行方案
  is_rapid_report boolean,-- 是否为快报 0、表示计划，1、表示突发
  disabled_status boolean DEFAULT 0, -- 0－未解除  1－已解除
  no_publish_reason varchar(500),-- 撤回原因
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  -- 4-已审核 原始数据 5-已审核 预审核数据
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID

  publish_user_id bigint(10),-- 发布人ID
  publish_date datetime, -- 发布时间
  state_block int(2), -- 道路通行状态
  approval_comments varchar(500), -- 审批意见
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (publish_user_id) REFERENCES User (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS PreSendBlockingMessage (
  --  Basic information of PreSendBlockingMessage.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  预审核阻断信息的id
  block_message_id bigint(10) NOT NULL, -- 阻断信息表ID
  examine_user	varchar(50),-- 审核人
  examine_status	int(1),-- 审核状态
  precombined_info	varchar(5000),-- 预整合信息
  combined_info	varchar(5000),-- 已整合信息

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (block_message_id) REFERENCES BlockingMessage (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS TransportAnomaly (
  --  Basic information of Authority.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  客运异常信息的id
  organization_id bigint(10),-- 主管单位ID  foreign key 机构表ID
  treatment_measures varchar(100),-- 	处置措施
  transport_route_start	varchar(100),-- 	客运班线起始地
  transport_route_end	varchar(100),-- 	客运班线终点
  transport_route_through	varchar(100),-- 	客运班线途经站点
  transport_route_start_time time,-- 	客运班线首班次时间
  transport_route_end_time time,-- 	客运班线末班次时间
  anomaly_reason int(2),-- 	异常原因类型
  estimated_recovery_time	datetime,-- 	预计客运班线恢复时间
  transport_service_interval time,-- 	客运班线发班间隔
  transport_route_operation_time time,-- 	客运班线运行时间
  vehicle_quantity int(3),-- 	客运班线运营车辆数
  service_price	double,-- 	客运班线票价
  publish_description	varchar(500),-- 	异常班线信息发布描述
  no_publish_reason varchar(500),-- 撤回原因
  traffic_opening_time datetime,-- 实际恢复通行时间

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布 3-待复审 4-待修改
  other_reason varchar(200),
  initial_emergency_id bigint(10),-- 初报ID
  initial_emergency_code int(1) DEFAULT 0,-- 初报标志位 0-初报事件 1-续报事件
  disabled_status boolean DEFAULT 0, -- 0－未解除  1－已解除

  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  -- 4-已审核 原始数据
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID
  push_information  varchar(2000), -- 推送信息
  approval_comments varchar(500), -- 审批意见
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS CountrolPoint (
  -- Basic information of CountrolPoint.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 重要控制点的id
  control_point_name varchar(50),-- 重要控制点名称
  road_id bigint(10) NOT NULL,-- 公路线路ID
  pile double(7,3),-- 桩号
  is_important_point boolean,-- 是否重要控制点

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS RoadManage (
  -- Basic information of RoadManage.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 公路管理表id
  road_id bigint(10) NOT NULL,-- 公路线路ID
  segment_start_pile double(7,3),-- 路段起点桩号
  segment_end_pile double(7,3),-- 路段止点桩号
  organization_id	bigint(10),-- 主管单位名称

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS ServiceAreaManage (
  -- Basic information of ServiceAreaManage.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 服务区管理表id
  service_area_id bigint(10),-- 服务区id
  organization_id	bigint(10),-- 主管单位id

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS TollStationManage (
  -- Basic information of TollStationManage.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 收费站管理表id
  toll_station_id bigint(10),-- 收费站id
  organization_id	bigint(10),-- 主管单位id

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS RoadBridges(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 桥梁明细表id
  road_id bigint(10) NOT NULL,-- 路线ID
  bridge_name varchar(30),-- 桥梁名称 [0]
  bridge_code varchar(20),-- 桥梁代码 [1]
  bridge_center_pile double(7,3),-- 桥梁中心桩号 [2]
  technical_grade varchar(20),-- 所属路线技术等级 [5]
  bridge_length double (7,2),-- 桥梁全长 [6]
  span_length double (7,1),-- 跨径总长 [7]
  haplopore_span double (5,1),-- 单孔最大跨径 [8]
  span_combination varchar(50),-- 跨径组合 [9]
  bridge_raw_width double (4,1),-- 桥梁全宽 [10]
  bridge_net_width double (4,1),-- 桥面净宽 [11]
  span_category_code int(1),-- 跨径分类代码 [12]
  span_category_type varchar(20),-- 跨径分类类型 [13]
  service_life_code int(1),-- 使用年限分类代码 [14]
  service_life_type varchar(20),-- 使用年限分类类型 [15]
  structure_code int(2),-- 结构形式代码 [16]
  structure_type varchar(20),-- 结构形式类型 [17]
  material_code int(2),-- 材料代码 [18]
  material_name varchar(20),-- 材料名称 [19]
  pier_code int(2),-- 桥墩类型代码 [20]
  pier_type varchar(20),-- 桥墩类型
  design_load_code int(1),-- 设计荷载等级代码
  design_load_type varchar(20),-- 设计荷载等级
  earthquake_proof_code int(1),-- 抗震等级代码
  earthquake_proof varchar(20),-- 抗震等级
  span_object_code int(1),-- 跨越地物代码
  span_object_type varchar(10),-- 跨越地物类型
  span_object_name varchar(20),-- 跨越地物名称
  traffic_grade varchar(10),-- 通航等级
  pier_anticollision_type varchar(10),-- 墩台防撞设施类型
  is_interchange boolean,-- 是否互通立交
  project_organization varchar(40),-- 建设单位
  design_organization varchar(40),-- 设计单位
  construct_organization varchar(40),-- 施工单位
  inspect_organization varchar(40),-- 监理单位
  build_year year,-- 修建年度
  complete_date date,-- 建成通车日期
  mantainance_organization_type int(1),-- 管养单位性质代码
  mantainance_organization varchar(40),-- 管养单位名称
  supervise_organization varchar(40),-- 监管单位名称
  toll_property_code int(1),-- 收费性质代码
  toll_property varchar(100),-- 收费性质
  ratings_code int(1),-- 评定等级代码
  ratings varchar(10),-- 评定等级
  ratings_date date,-- 评定日期
  ratings_organization varchar(40),-- 评定单位
  modify_year year,-- 改造年度
  modify_complete_date date,-- 完工日期
  modify_parts varchar(20),-- 改造部位
  engineering_property varchar(10),-- 工程性质
  modify_construct_organization varchar(40),-- 改造施工单位
  is_subsidy boolean,-- 是否部补助项目
  disease_area varchar(50),-- 当前主要病害部位
  disease_description varchar(200),-- 当前主要病害
  traffic_regular_code int(1),-- 交通管制措施代码
  traffic_regular varchar(10),-- 交通管制措施
  area_code int(6),-- 所在政区代码
  remarks varchar(500),-- 备注

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间

  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS RoadTunnel(
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 隧道明细表id
  road_id bigint(10) NOT NULL,-- 路线ID
  channel_name varchar(30),-- 隧道名称
  channel_code varchar(30),-- 隧道代码
  channel_center_pile double(7,3),-- 隧道中心桩号
  technical_grade varchar(10),-- 所属路线技术等级
  channel_length double(8,3),-- 隧道长度
  channel_net_width double(5,2),-- 隧道净宽
  channel_net_height double(5,1),-- 隧道净高
  length_category_code int(1),-- 隧道长度分类代码
  length_category varchar(20),-- 隧道长度分类
  is_underwater boolean,-- 是否水下隧道
  build_year year,-- 修建年度
  project_organization varchar(40),-- 建设单位名称
  design_organization varchar(40),-- 设计单位名称
  construct_organization varchar(40),-- 施工单位名称
  inspect_organization varchar(40),-- 监理单位名称
  complete_date date,-- 建成通车时间
  mantainance_organization_type int(1),-- 管养单位性质代码
  mantainance_organization varchar(40),-- 管养单位名称
  supervise_organization varchar(40),-- 监管单位名称
  ratings varchar(20),-- 评定等级
  ratings_date date,-- 评定日期
  ratings_organization varchar(40),-- 评定单位
  modify_year year,-- 改造年度
  modify_complete_date date,-- 完工日期
  modify_parts varchar(20),-- 改造部位
  engineering_property varchar(20),-- 工程性质
  disease_area varchar(20),-- 当前主要病害部位
  disease_description varchar(20),-- 当前主要病害描述
  area_code int(6),-- 政区代码
  remarks varchar(500),-- 备注

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间

  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 每日报送表
CREATE TABLE IF NOT EXISTS DailyReport (
  --  Basic information of Authority.
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  简报信息的id
  organization_type int(1), -- 报送类型。
  -- 1 公路局 RoadCustodianReport,  2 路政执法局 RoadCustodianReport , 3 高速公路管理局 HighwayCustodianReport,
  -- 4 运管局 TrafficCustodianReport, 5 水运局 DockCustodianReport
  road_line_json varchar(1000), -- 运行线路json数据
  -- {traffic: {all: 100, normal: 90, abnormal: 10}}
  -- {dock: {all: 100, normal: 90, abnormal: 10}, waterage: {all: 80, normal: 50, abnormal: 30}}
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 甘肃省公路局实时路况信息报送表(公路管理局, 路政执法局)
CREATE TABLE IF NOT EXISTS RoadCustodianReport (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 路况信息的id
  daily_report_id bigint(10), -- 每日报送表 id
  road_id bigint(10) NOT NULL, -- 路线编号
  organization_id bigint(10),  -- 信息上报单位 id
  segment_start_pile double(7,3), -- 起点桩号
  segment_end_pile double(7,3), -- 止点桩号
  direction_of_blocking int(1),-- 阻断发生方向,上行线,下行线 (上行1,下行2,双向3)
  direction_of_blocking_description varchar(500),-- 阻断方向说明(影响行车方向)
  report_location varchar(100), -- 阻断地点名称 阻断(事件)位置
  accident_description varchar(500), -- 事件描述
  is_traffic_jam boolean, -- 是否有车辆拥堵
  traffic_jam_description varchar(500), -- 车辆拥堵说明
  is_traffic_reroute boolean, -- 是否需要车辆绕行
  traffic_reroute_description varchar(500), -- 车辆绕行说明
  estimated_recovery_time datetime, -- 预计恢复时间
  report_time datetime, -- 报告时间
  hint_text varchar(500), -- 提示语
  organization_type int(1), -- 1公路管理局, 2路政执法局
  blocking_area varchar(100),-- 阻断发生区域 行政区划代码

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布 3-等待终审
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  no_publish_reason varchar(50), -- 撤回原因。
  push_information varchar(2000), -- 生成非结构化字段存储
  FOREIGN KEY (daily_report_id) REFERENCES DailyReport (id),
  FOREIGN KEY (road_id) REFERENCES RoadInformation (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- 甘肃省公路局实时路况信息报送表(高速公路管理局)
CREATE TABLE IF NOT EXISTS HighwayCustodianReport (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  信息报送的id
  -- road_id bigint(10) NOT NULL, -- 路线编号, 路线名称
  daily_report_id bigint(10), -- 每日报送表 id
  organization_id bigint(10),  -- 信息上报单位 id
  toll_station_id bigint(10), -- 收费站id
  is_entrance_blocked boolean, -- 进口是否拥堵
  is_exit_blocked boolean, -- 出口是否拥堵

  is_traffic_bypass boolean, -- 是否需要车辆分流
  traffic_bypass_description varchar(500), -- 车辆分流说明

  is_traffic_reroute boolean, -- 是否需要车辆绕行
  reroute_reason varchar(500), -- 车辆绕行原因(施工或故障等)
  vehicle_type varchar(50), -- 绕行车辆类型
  --  reroute_entrance_direction varchar(50), -- 收费站进口绕行车辆行驶方向
  --  reroute_entrance varchar(50), -- 收费站进口绕行车辆驶入收费站
  reroute_entrance_json varchar(1000), -- 收费站进口绕行车辆行驶方向和驶入收费站名称
  -- [{"direction": "direction1", "toll_station": "toll_station"}]
  reroute_exit_json varchar(1000), -- 收费站进口绕行车辆行驶方向和驶入收费站名称
  -- [{"direction": "direction1", "toll_station": "toll_station1"}]
  report_time datetime, -- 报告时间

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID
  push_information varchar(2000), -- 生成非结构化字段存储
  no_publish_reason varchar(50), -- 撤回信息的原因
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (daily_report_id) REFERENCES DailyReport (id),
  FOREIGN KEY (toll_station_id) REFERENCES TollStation (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- 甘肃省客运班线实时路况运行信息报送表
CREATE TABLE IF NOT EXISTS TrafficCustodianReport (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  信息报送的id
  daily_report_id bigint(10), -- 每日报送表 id
  organization_id bigint(10),  -- 信息上报单位 id
  transport_route_start	varchar(100),-- 客运班线起始地
  transport_route_end	varchar(100),-- 客运班线途经站点(客运班线途经站点)
  anomaly_reason varchar(500),-- 	异常原因类型
  estimated_recovery_time	datetime,-- 	预计客运班线恢复时间
  travel_adjust_advice varchar(1000), -- 建议出行方案
  report_time datetime, -- 报告时间

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID
  push_information varchar(2000), -- 生成非结构化字段存储
  no_publish_reason varchar(500),-- 撤回原因
  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (daily_report_id) REFERENCES DailyReport (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




-- 甘肃省水运实时路况运行信息报送表(码头)
CREATE TABLE IF NOT EXISTS DockCustodianReport (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  信息报送的id
  daily_report_id bigint(10), -- 每日报送表 id
  organization_id bigint(10),  -- 信息上报单位 id
  dock_name varchar(100), -- 码头名称
  anomaly_reason varchar(500),-- 	异常原因类型
  handle_description varchar(1000), -- 采取措施
  estimated_recovery_time	datetime,-- 	预计客运班线恢复时间
  report_time datetime, -- 报告时间

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID
  push_information varchar(2000), -- 生成非结构化字段存储

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  no_publish_reason varchar(50), -- 撤回信息的原因
  FOREIGN KEY (daily_report_id) REFERENCES DailyReport (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




-- 甘肃省水运实时路况运行信息报送表(水运路线)
CREATE TABLE IF NOT EXISTS WaterageCustodianReport (
  id bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY, --  信息报送的id
  daily_report_id bigint(10), -- 每日报送表 id
  organization_id bigint(10),  -- 信息上报单位 id
  transport_route_start	varchar(100),-- 	水运路线起始地
  transport_route_end	varchar(100),-- 	水运路线终点
  anomaly_reason varchar(500),-- 	异常原因类型
  handle_description varchar(1000), -- 采取措施
  estimated_recovery_time	datetime,-- 	预计客运班线恢复时间
  report_time datetime, -- 报告时间
  push_information varchar(2000), -- 生成非结构化字段存储

  publish_status int(1) DEFAULT 0,-- 发布状态  0-未发布 1-已发布 2-无价值信息 不予发布
  review_status int(1) DEFAULT 0, -- 数据状态 0-原始数据  1-预审核数据  2-已审核数据 3-过期数据（已被续报替换）
  original_data_id bigint(10), -- 如数据处于审核状态，此字段代表原始数据ID
  no_publish_reason varchar(50), -- 撤回信息的原因
  -- 不予发布  原始信息 publish_status=2
  -- 提交至领导，新建一条，review_status＝1， publish_status＝0, original_data_id, 原publish_status＝3
  -- 审核通过，新建一条，review_status＝2， 原publish_status＝1,  original_data_id

  create_user_id bigint(10), -- 创建人ID
  create_date datetime, -- 创建时间
  update_user_id bigint(10), -- 更新人ID
  update_date datetime,-- 更新时间
  FOREIGN KEY (daily_report_id) REFERENCES DailyReport (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (update_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Users' chat or users' feedback
CREATE TABLE IF NOT EXISTS UserChat (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  source_user_id bigint NOT NULL,
  target_user_id bigint NOT NULL,
  chat_time datetime ,
  type int , -- The type can 1 user-to-user and 2 system-to-user.
  content varchar(1000) NOT NULL, -- The length of the content could not be larger than 400
  event_id int(11) DEFAULT '0',  -- 事件ID
  event_type int(1) DEFAULT '0', -- 0:突发事件；1计划施工；2客运异常；3：实时路况
  sent_state boolean NOT NULL DEFAULT 0 -- sent or not.  用户是否阅读  0 用户尚未阅读  1 用户已经阅读
  -- FOREIGN KEY (source_user_id) REFERENCES User (id),
  -- FOREIGN KEY (target_user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Users onduty table
CREATE TABLE IF NOT EXISTS UserOnDuty (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_type int(1), --  1-领导 2-值班人员 （TODO）大屏展示
  onduty_start_time datetime, -- 值班开始时间
  onduty_end_time datetime, -- 值班结束时间
  user_id bigint(10), -- 值班人员ID
  FOREIGN KEY (user_id) REFERENCES User (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 记录日志
CREATE TABLE IF NOT EXISTS Logging (
  logid int(10) NOT NULL AUTO_INCREMENT,
  user_id varchar(100) DEFAULT NULL, -- 操作用户
  op_type int(1) DEFAULT NULL, -- 操作类型  1：登录；2：新增；3：修改；4：删除
  op_date datetime DEFAULT NULL, -- 操作时间
  op_content varchar(1000) DEFAULT NULL, -- 操作内容
  ip varchar(200) DEFAULT NULL,  -- ip地址
  city  varchar(200) DEFAULT NULL,  -- 登录城市
  PRIMARY KEY (logid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- 添加索引 （TODO)(分配到表定义内）
-- ALTER TABLE Organization ADD INDEX index_organization_number (organization_number);
-- ALTER TABLE User ADD INDEX index_login_name (login_name);
-- ALTER TABLE RoadInformation ADD INDEX index_road_name (road_name);
-- ALTER TABLE RoadInformation ADD INDEX index_road_code (road_code);
-- 发布后信息日志表
CREATE TABLE IF NOT EXISTS publishinfolog (
  `id` bigint(20) NOT NULL, -- ip地址
  `user_id` bigint(20) DEFAULT NULL, -- 用户名
  `update_date` datetime DEFAULT NULL, -- 跟新时间
  `event_id` bigint(20) DEFAULT NULL, -- 事件id
  `event_type` int(11) DEFAULT NULL, -- 事件类型
  `road_code` varchar(50) DEFAULT NULL, -- 路id
  `road_name` varchar(50) DEFAULT NULL, -- 路名
  `contents` varchar(2000) DEFAULT NULL, -- 内容
  `remark` varchar(500) DEFAULT NULL, -- 备注
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 记录微信提交信息
CREATE TABLE IF NOT EXISTS `weixininformation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `site_id` bigint(10),
  `create_time` datetime DEFAULT NULL,  -- 创建时间
  `location` varchar(150) DEFAULT NULL,  -- 路况地点（公众）
  `supplier_name` varchar(150) DEFAULT NULL, -- 姓名（公众）
  `is_checked` int(1) DEFAULT NULL,  -- 是否发布
  `contents` varchar(2000) DEFAULT NULL, -- 路况描述
  `type` int(1) DEFAULT NULL,  -- 0：公众;1内部
  `road_code` varchar(50) DEFAULT NULL,   -- 线路编号
  `road_name` varchar(200) DEFAULT NULL,  -- 线路名称
  `break_point` varchar(200) DEFAULT NULL, -- 阻断位置
  `break_direct` int(1) DEFAULT NULL,  -- 阻断方向0：单行上；1单行下;2:双向上3:双向下
  `segment_start_pile` varchar(200) DEFAULT NULL, -- 开始桩号
  `segment_end_pile` varchar(200) DEFAULT NULL, -- 结束桩号
  `mng_org_name` varchar(200) DEFAULT NULL,  -- 管理单位
  `phone` varchar(200) DEFAULT NULL,   -- 联系电话
  `contacter_name` varchar(200) DEFAULT NULL, -- 联系人
  `img_path` varchar(1000) DEFAULT NULL,  -- 图片路径
  `remark2` varchar(1000) DEFAULT NULL,
  `event_type` int(1) DEFAULT NULL,    -- 事件类型
  `nickname` varchar(500) DEFAULT NULL,  -- 用户昵称
  `avatar_imgurl` varchar(1000) DEFAULT NULL, -- 用户头像URL
  `open_id` varchar(100) DEFAULT NULL,    -- 微信会话ID
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
-- 大屏展示用户表
CREATE TABLE IF NOT EXISTS `dutytables` (
  `id` int(10) NOT NULL AUTO_INCREMENT, -- id
  `duty_date` date DEFAULT NULL, -- 值班日期
  `duty_week` varchar(10) DEFAULT NULL, -- 星期
  `duty_first_user` varchar(10) DEFAULT NULL, -- 第一班
  `duty_second_user` varchar(10) DEFAULT NULL, -- 第二班
  `duty_third_user` varchar(10) DEFAULT NULL, -- 第三班
  `duty_fourth_user` varchar(10) DEFAULT NULL, -- 第四班
  `duty_monitor` varchar(10) DEFAULT NULL, -- 值班班长
  `duty_leader` varchar(10) DEFAULT NULL, -- 值班领导
  `update_time` datetime DEFAULT NULL, -- 更新时间
  `update_user` varchar(10) DEFAULT NULL, -- 更新人
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1143 DEFAULT CHARSET=utf8;
-- 值班日志
CREATE TABLE IF NOT EXISTS `dutylog` (
  `id` int(10) NOT NULL AUTO_INCREMENT, -- id
  `duty_user` varchar(10) DEFAULT NULL, -- 值班人员
  `duty_monitor` varchar(10) DEFAULT NULL, -- 值班班长
  `duty_leader` varchar(10) DEFAULT NULL, -- 值班领导
  `start_time` varchar(100) DEFAULT NULL, -- 开始时间
  `end_time` varchar(100) DEFAULT NULL, -- 结束时间
  `handover_matters` varchar(500) DEFAULT NULL, -- 交接事项
  `equipment_operation` int(1) DEFAULT NULL, -- 设备情况
  `equipment_operation_description` varchar(500) DEFAULT NULL, -- 设备异常原因
  `network_operation` int(1) DEFAULT NULL, -- 网络情况
  `network_operation_description` varchar(500) DEFAULT NULL, -- 网络异常原因
  `system_operation` int(1) DEFAULT NULL, -- 系统情况
  `system_operation_desription` varchar(500) DEFAULT NULL, -- 系统异常原因
  `create_date` datetime DEFAULT NULL, -- 创建时间
  `event_description` varchar(500) DEFAULT NULL, -- 事件描述
  `update_user` varchar(10) DEFAULT NULL, -- id
  `update_date` datetime DEFAULT NULL, -- id
  `remarks` varchar(500) DEFAULT NULL, -- id
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
-- 预警信息
CREATE TABLE IF NOT EXISTS `roadearlywarningreport` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` INT(10) DEFAULT NULL , --  组织结构id
  `road_id` INT(10) DEFAULT NULL , --  路线id
  `create_user_id` INT(10) DEFAULT NULL , --  事件创建人ID
  `earlywarning_area` INT(10) DEFAULT NULL , --  行政区划
  `earlywarning_reason` VARCHAR(500) DEFAULT NULL , --  预警原因
  `event_reason` VARCHAR(500) DEFAULT NULL , --  事件原因
  `create_time` DATETIME DEFAULT NULL , --  事件创建时间
  `publish_status` INT(1) DEFAULT NULL , --  发布状态  0或者4-原始数据 1或者5-初审 2-发布 3 不予发布 6-退回信息'
  `initial_emegency_id` VARCHAR(20) DEFAULT NULL,
  `demp_no` INT(2) DEFAULT NULL , --  各个局的编号 1 公路局 2 路政执法局 3 高速公路管理局
  `not_publish_reason` VARCHAR(500) DEFAULT NULL , -- 不予发布的原因
  `return_status` INT(1) DEFAULT NULL , --  各个局的编号 1 公路局 2 路政执法局 3 高速公路管理局  4 运管局
  `push_information` VARCHAR(500) DEFAULT NULL , -- 推送消息
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8;

-- 创建运管局预警信息表
CREATE TABLE IF NOT EXISTS `transportwarningreport` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_id` INT(10) DEFAULT NULL COMMENT '组织结构id',
  `create_user_id` INT(10) DEFAULT NULL COMMENT '事件创建人ID',
  `transport_route_start` VARCHAR(100) DEFAULT NULL COMMENT '客运起点',
  `transport_route_end` VARCHAR(100) DEFAULT NULL COMMENT '客运终点',
  `earlywarning_reason` VARCHAR(500) DEFAULT NULL COMMENT '预警原因',
  `emergency_abstrat` VARCHAR(500) DEFAULT NULL COMMENT '事件描述',
  `create_time` DATETIME DEFAULT NULL COMMENT '事件创建时间',
  `publish_status` INT(1) DEFAULT NULL COMMENT '发布状态 0-未审核 1- 已发布 2-待审核 3-不予发布 6-退回',
  `not_publish_reason` VARCHAR(500) DEFAULT NULL COMMENT '不予发布的原因',
  `return_status` INT(1) DEFAULT NULL COMMENT '退回状态 1-退回 0默认',
  `push_information` VARCHAR(500) DEFAULT NULL COMMENT '推送消息',
  `is_leader` INT(11) DEFAULT NULL COMMENT '1-值班人员审核 2-领导审核 3-领导退回 4-值班人员退回 5-上报人员',
  `initial_emergency_id` INT(10) DEFAULT NULL,
  `information_state` INT(1) DEFAULT NULL COMMENT '该条信息状态 0-初报 1-初次审核 2-领导发布 3-不予发布 4-值班人员退回 5-领导退回',
  `user_before_id` INT(10) DEFAULT NULL COMMENT '退回功能找到上一个报送人id',
  PRIMARY KEY (`id`),
  FOREIGN KEY (create_user_id) REFERENCES User (id),
  FOREIGN KEY (organization_id) REFERENCES Organization (id),
) ENGINE=INNODB DEFAULT CHARSET=utf8;
-- 创建高德地图上报表
create table IF NOT EXISTS `autonavimapdata` (
	`id` bigint(10) NOT NULL AUTO_INCREMENT PRIMARY KEY ,
	`organization_id` bigint(10) ,
	`road_id` bigint(10) ,
	`start_point` varchar (30),
	`end_point` varchar (30),
	`blocking_area` varchar (100),
	`publish_time` datetime ,
	`event_description` varchar (1500),
	`jam_start` varchar (30),
	`jam_area` varchar (30),
	`publish_status` int(1) ,
	`report_status` int(1) ,
  `publish_status_show` int(1) ,
  `report_status_show` int(1) ,
	`push_information` varchar (1500),
  `create_user_id` int(1),
  `create_date` datetime,
  `initial_emergency_id` bigint(10),
  `is_important` int(1)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
