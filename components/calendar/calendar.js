// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    monthCount:{ //生成几个月的日历 默认6
      type:Number,
      value:6
    },
    isDisable:{ //是否尾部禁用
      type:Boolean,
      value:false
    },
    disNumDay: { // 从今天起 disNumDay 天之后的日期禁用 默认45
      type:Number,
      value:30
    },
    isCurrentMonth:{ //生成的日历开始月份是否包含本月,默认包含本月
      type:Boolean,
      value:true
    },
    isDoubleSelection:{ //是否开启日期双选 开始与结束时间
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks:["日","一","二","三","四","五","六"],
    dateList:[], //生成的时间数据
    selectedDate:{}, //用户点选的时间,默认今天
    clickCount:0 //用户点击次数记录 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //生成时间对象,默认6个月,默认从当前月数的1号开始
    createdDate() {
      let dateAllArr = [] //日历数据列表
      let { year, month, day, week } = this.getYearMonthDayWeek(new Date()) 
      let dateCount = this.properties.monthCount //生成monthCount个月的日期列表
      let disNumDay = this.properties.disNumDay //是否日期尾部禁用
      if(this.properties.isCurrentMonth){
        month -= 1 //包含本月-1 
      }
      for (let i = 0; i < dateCount; i++) { //循环生成年月份数据
        month = Number(month) + 1;
        if (month > 12) {
          year++
          month -= 12
        }
        const dayNum = this.getDayNumByYearMoth(year, month,"01","00:00") //计算对应月份的总天数
        const startWeek = new Date(year,month,1).getDay() //获取每个月1号是周几开始
        let everyDay = []
        for (let j = 1; j <= dayNum; j++) {
          //组装每一天数据
          const day = j
          //计算是否是已过去的时间
          const diffNumTime = this.diffTime(`${year}-${month}-${day}`, Date.now())
          let disTime = false  
          
          if (diffNumTime < 0){
            disTime = true
          } else{
            disTime = false
          }
          if (this.properties.isDisable && diffNumTime > disNumDay){
            disTime = true
          }
          // 组装每一天的数据对象
          everyDay[j-1] = {
            year,
            month,
            day,
            disTime,
            date: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
          }
        }
        dateAllArr[i] = {
          year,
          month,
          monthTitle: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"][month - 1],
          day:1,
          everyDay,
          startWeek
        }
      }
      this.setData({
        dateList: dateAllArr
      })
      console.log("生成的日历数据对象---", dateAllArr)
    },
    //时间天数差计算
    diffTime(startTime,endTime){ 
      let diff = (new Date(startTime).getTime()) - (new Date(endTime).getTime())
      let result = parseInt(diff / (1000 * 60 * 60 * 24));
      return result
    },
    //判断是否为闰年
    isLeapYear(year) {
      if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
        return true
      } else {
        return false
      }
    },
    //获取时间
    getYearMonthDayWeek(date) {
      let year = new Date(date).getFullYear()
      let month = new Date(date).getMonth() + 1
      let day = new Date(date).getDate()
      let week = new Date(date).getDay()
      return { year, month, day, week }
    },
    //计算每个月的天数
    getDayNumByYearMoth(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
          break
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
          break;
        case 2:
          return this.isLeapYear(year) ? 29 : 28;
      }
    },
    //用户选择日期事件
    selectedDay(e){
      let selectedDate = e.currentTarget.dataset.item
      //判断是单选模式还是双选模式
      if (this.properties.isDoubleSelection){
        this.doubleSelection(selectedDate)
      }else{
        this.setData({ selectedDate })
        //todo 单选模式完毕在这执行子传父事件,调起父组件的事件
        this.triggerEvent("change", { selectedDate })
      }
    },
    //双选模式
    doubleSelection(selectedDate){
      let clickCount = ++this.data.clickCount
      if (clickCount%2===0){
        this.setData({ endTime: selectedDate })
        // 开始的时间 - 结束的时间  = 结果为正数,代表第一次点选的开始时间大于结束时间,所以交换位置 
        let startTime = this.data.startTime
        let endTime = this.data.endTime
        let diffTime = this.diffTime(startTime.date, endTime.date)
        if (diffTime > 0) { //计算时间,交换开始结束时间
          let temDate = startTime
          startTime = endTime
          endTime = temDate
          console.log("交换时间", startTime, endTime)
        }
        //循环遍历日历数据,如果在开始和结束时间之间加上选中样式
        let dateList = this.data.dateList
        //拿到开始时间到结束时间的绝对值,也就是 开始时间距离结束时间有abs天
        let abs = Math.abs(this.diffTime(startTime.date, endTime.date))
        //循环遍历数组, item.date - startTime  =  0:开始时间 && 小于 abs
        dateList.map((item) => {
          item.everyDay.map((everyDayItem, index) => {
            const diffDate = this.diffTime(everyDayItem.date, startTime.date)
            if (diffDate > 0 && diffDate < abs) {
              everyDayItem.diffDate = true
            }
          })
        })
        this.setData({ dateList, startTime, endTime })
        this.triggerEvent('change', { startTime, endTime})
      }else{
        let dateList = this.data.dateList
        dateList.map(item => {
          item.everyDay.map(everyDayItem=>everyDayItem.diffDate=false)
        })
        this.setData({ startTime: selectedDate, selectedDate, dateList ,endTime:{} })
      }
    
    },
    //设置默认选择为今天的时间
    setSelectDay(){
      let { year, month, day } = this.getYearMonthDayWeek(new Date())
      let selectedDate = {
        year,
        month,
        day,
        date: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
      }
      this.setData({ selectedDate })
    },
  },
  lifetimes:{
    created(){},
    attached() {
      this.createdDate() //生成时间数据
      this.setSelectDay() //
    },
  }
})
