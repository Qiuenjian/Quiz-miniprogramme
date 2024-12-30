Page({
  data: {
    employeeId: '',
    password: ''
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  async login() {
    const { employeeId, password } = this.data;
    if (!employeeId || !password) {
      wx.showToast({
        title: '请输入工号和密码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...'
    });

    try {
      // 先调用初始化管理员账号的云函数
      await wx.cloud.callFunction({
        name: 'initAdmin'
      });

      // 然后尝试登录
      const res = await wx.cloud.callFunction({
        name: 'login',
        data: {
          employeeId,
          password
        }
      });

      wx.hideLoading();
      console.log('登录结果：', res); // 添加调试日志

      if (res.result.success) {
        wx.setStorageSync('userInfo', res.result.userInfo);
        wx.switchTab({
          url: '/pages/index/index'
        });
      } else {
        wx.showToast({
          title: res.result.message || '登录失败，请检查工号和密码',
          icon: 'none'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('登录错误：', err); // 添加错误日志
      wx.showToast({
        title: '登录失败，请稍后重试',
        icon: 'none'
      });
    }
  }
}); 