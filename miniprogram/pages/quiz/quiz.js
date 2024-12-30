Page({
  data: {
    quizzes: [],
    currentIndex: 0,
    loading: true,
    error: '',
    selectedAnswer: '',
    answers: []  // 存储用户的答案
  },

  onLoad() {
    this.loadQuizzes();
  },

  async loadQuizzes() {
    this.setData({ loading: true, error: '' });

    try {
      console.log('开始加载题目');
      const res = await wx.cloud.callFunction({
        name: 'getQuizForAnswer',
        timeout: 10000
      });
      console.log('云函数返回结果：', res);

      if (res.result.success) {
        if (!res.result.list || res.result.list.length === 0) {
          this.setData({
            error: '暂无可答题目',
            loading: false
          });
          return;
        }

        this.setData({
          quizzes: res.result.list,
          loading: false
        });
      } else {
        throw new Error(res.result.message);
      }
    } catch (err) {
      console.error('加载题目失败：', err);
      this.setData({
        error: err.message || '网络错误，请重试',
        loading: false
      });
    }
  },

  // 选择答案
  selectOption(e) {
    const { option } = e.currentTarget.dataset;
    this.setData({ selectedAnswer: option });
  },

  // 下一题或提交
  nextQuestion() {
    const { currentIndex, quizzes, selectedAnswer, answers } = this.data;
    
    // 保存当前答案
    answers.push({
      questionId: quizzes[currentIndex]._id,
      answer: selectedAnswer
    });

    if (currentIndex < quizzes.length - 1) {
      // 还有下一题
      this.setData({
        currentIndex: currentIndex + 1,
        selectedAnswer: '',
        answers
      });
    } else {
      // 答题完成，提交答案
      this.submitAnswers();
    }
  },

  // 提交答案
  async submitAnswers() {
    try {
      wx.showLoading({
        title: '正在提交...',
        mask: true
      });

      const res = await wx.cloud.callFunction({
        name: 'submitAnswers',
        data: {
          answers: this.data.answers
        }
      });

      wx.hideLoading();

      if (res.result.success) {
        // 显示得分
        wx.showModal({
          title: '答题完成',
          content: `本次得分：${res.result.score}分`,
          showCancel: false,
          success: () => {
            // 返回上一页
            wx.navigateBack();
          }
        });
      } else {
        throw new Error(res.result.message);
      }
    } catch (err) {
      wx.hideLoading();
      console.error('提交答案失败：', err);
      wx.showToast({
        title: err.message || '提交失败，请重试',
        icon: 'none'
      });
    }
  },

  retry() {
    this.loadQuizzes();
  }
}); 