// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'personal',
    rankList: [],
    pageNum: 1,
    pageSize: 20,
    hasMore: true,
    isRefreshing: false,
    userInfo: {
      avatar: '/images/default-avatar.jpg'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadRankList('personal');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadRankList(tab);
  },

  navigateBack() {
    wx.navigateBack();
  },

  async loadRankList(type, isRefresh = false) {
    if (isRefresh) {
      this.setData({ pageNum: 1 });
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'getRankList',
        data: { 
          type,
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize
        }
      });

      if (res.result.success) {
        const newList = res.result.list || [];
        this.setData({
          rankList: isRefresh ? newList : [...this.data.rankList, ...newList],
          hasMore: newList.length === this.data.pageSize,
          pageNum: this.data.pageNum + 1
        });
      }
    } catch (err) {
      console.error('获取排行榜失败：', err);
    }
  },

  // 下拉刷新
  async onRefresh() {
    this.setData({ isRefreshing: true });
    await this.loadRankList(this.data.currentTab, true);
    this.setData({ isRefreshing: false });
  },

  // 加载更多
  onLoadMore() {
    if (this.data.hasMore) {
      this.loadRankList(this.data.currentTab);
    }
  }
})