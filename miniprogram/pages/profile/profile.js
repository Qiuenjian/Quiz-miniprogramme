Page({
  data: {
    userInfo: {},
    isAdmin: false,
    stats: {
      totalScore: 1280,
      participationCount: 24,
      correctRate: '85%',
      ranking: '5/42'
    }
  },

  onLoad() {
    this.getUserInfo();
    this.loadUserStats();
  },

  onShow() {
    this.getUserInfo();
    this.loadUserStats();
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    this.setData({ 
      userInfo,
      isAdmin: userInfo.role === 'admin'
    });
  },

  async loadUserStats() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getUserStats'
      });
      if (res.result.success) {
        this.setData({
          stats: res.result.stats
        });
      }
    } catch (err) {
      console.error('获取用户统计信息失败：', err);
    }
  },

  // 点击参赛记录
  goToRecords() {
    wx.navigateTo({
      url: '/pages/records/records'
    });
  },

  // 点击基础设置
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 点击修改密码
  goToChangePassword() {
    wx.navigateTo({
      url: '/pages/change-password/change-password'
    });
  },

  // 点击个人信息设置
  goToPersonalInfo() {
    wx.navigateTo({
      url: '/pages/personal-info/personal-info'
    });
  },

  // 点击通知设置
  goToNotifications() {
    wx.navigateTo({
      url: '/pages/notifications/notifications'
    });
  }
}); 