//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
  },
  //事件
  onChange(e){
    console.log(e,"页面的事件")
    let { startTime, endTime, selectedDate} = e.detail
    if (selectedDate){
      wx.showToast({
        title: `单选的时间:${selectedDate.date}`,
        maskt: true,
        duration: 3000,
        icon: "none"
      })
    }
    if (startTime && endTime){
        wx.showToast({
          title: `开始时间:${startTime.date}
          结束时间:${endTime.date}`,
          maskt:true,
          duration:3000,
          icon:"none"
       })
    }
  
  },
  onLoad: function () {
    
  }
 
})
