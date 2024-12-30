// pages/battle/battle.js
Page({
  data: {
    userInfo: {},
    onlineUsers: [], // 在线可对战用户列表
    battleMode: 'random', // random: 随机匹配, friend: 好友对战
    isMatching: false, // 是否正在匹配中
    matchCountdown: 30, // 匹配倒计时
    timer: null
  },

  onLoad() {
    this.getUserInfo();
    this.getOnlineUsers();
  },

  onShow() {
    // 页面显示时刷新在线用户列表
    this.getOnlineUsers();
  },

  async getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    this.setData({ userInfo });
  },

  async getOnlineUsers() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getOnlineUsers'
      });
      this.setData({
        onlineUsers: res.result.users.filter(user => user._id !== this.data.userInfo._id)
      });
    } catch (err) {
      console.error('获取在线用户失败：', err);
    }
  },

  // 切换对战模式
  switchMode(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({ battleMode: mode });
  },

  // 开始匹配
  startMatching() {
    this.setData({ 
      isMatching: true,
      matchCountdown: 30
    });

    // 开始倒计时
    this.data.timer = setInterval(() => {
      if (this.data.matchCountdown <= 0) {
        this.cancelMatching();
        return;
      }
      this.setData({
        matchCountdown: this.data.matchCountdown - 1
      });
    }, 1000);

    // 调用匹配接口
    this.findOpponent();
  },

  // 取消匹配
  cancelMatching() {
    clearInterval(this.data.timer);
    this.setData({ 
      isMatching: false,
      matchCountdown: 30
    });
    // 调用取消匹配接口
    wx.cloud.callFunction({
      name: 'cancelMatching',
      data: {
        userId: this.data.userInfo._id
      }
    });
  },

  // 查找对手
  async findOpponent() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'findOpponent',
        data: {
          userId: this.data.userInfo._id,
          mode: this.data.battleMode
        }
      });

      if (res.result.success) {
        clearInterval(this.data.timer);
        // 跳转到对战答题页面
        wx.navigateTo({
          url: `/pages/quiz/quiz?id=${res.result.quizId}&mode=battle&opponent=${res.result.opponentId}`
        });
      }
    } catch (err) {
      console.error('匹配对手失败：', err);
      this.cancelMatching();
      wx.showToast({
        title: '匹配失败，请重试',
        icon: 'none'
      });
    }
  },

  // 邀请好友对战
  inviteUser(e) {
    const { userId } = e.currentTarget.dataset;
    wx.showLoading({
      title: '发送邀请中'
    });

    wx.cloud.callFunction({
      name: 'inviteBattle',
      data: {
        inviterId: this.data.userInfo._id,
        inviteeId: userId
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result.success) {
        wx.showToast({
          title: '邀请已发送',
          icon: 'success'
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('发送邀请失败：', err);
      wx.showToast({
        title: '邀请失败，请重试',
        icon: 'none'
      });
    });
  },

  onUnload() {
    clearInterval(this.data.timer);
  }
});