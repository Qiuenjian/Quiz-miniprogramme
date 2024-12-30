Page({
  data: {
    userInfo: {},
    isAdmin: false,
    competitions: [
      {
        id: 1,
        title: '2024年第一季度知识竞赛',
        image: '/images/competition1.jpg',
        participants: 1280,
        remainingDays: 3
      },
      {
        id: 2,
        title: '新员工入职知识竞赛',
        image: '/images/competition2.jpg',
        participants: 856,
        remainingDays: 5
      },
      {
        id: 3,
        title: '产品知识专项竞赛',
        image: '/images/competition3.jpg',
        participants: 623,
        remainingDays: 7
      },
      {
        id: 4,
        title: '营销技能大比拼',
        image: '/images/competition4.jpg',
        participants: 945,
        remainingDays: 4
      }
    ],
    navItems: [
      {
        icon: 'icon-book',
        text: '题库练习',
        action: 'goToExercise'
      },
      {
        icon: 'icon-random',
        text: '随机匹配',
        action: 'goToRandomMatch'
      },
      {
        icon: 'icon-users',
        text: '好友对战',
        action: 'goToFriendBattle'
      },
      {
        icon: 'icon-history',
        text: '历史记录',
        action: 'goToHistory'
      }
    ]
  },

  onLoad() {
    this.getUserInfo();
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

  goToExercise() {
    wx.navigateTo({
      url: '/pages/exercise/exercise'
    });
  },

  goToRandomMatch() {
    wx.navigateTo({
      url: '/pages/random-match/random-match'
    });
  },

  goToFriendBattle() {
    wx.navigateTo({
      url: '/pages/friend-battle/friend-battle'
    });
  },

  goToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  }
}); 