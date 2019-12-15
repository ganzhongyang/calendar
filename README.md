# 小程序日历组件

#### 介绍
适用于酒店,机票,火车票项目!支持双选!

#属性             类型          默认值	    必填        说明

monthCount        Number        6            否        从当前月数起,往后生成N个月的日历数据;默认6个月
isCurrentMonth    Boolean       true         否        生成的日历开始月份是否包含本月,默认包含本月
isDisable         Boolean       false        否        是否开启日历尾部时间禁用,默认从当前日期开始后的45天
disNumDay         Number        45           否        isDisable属性如果为true,从今天起 disNumDay 天之后的日期禁用默认45天
isDoubleSelection Boolean       false        否        是否开启日期双选模式开始与结束时间,默认单选模式:即只选择一个日期
