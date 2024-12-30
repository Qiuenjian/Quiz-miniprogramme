// pages/admin/quiz-manage/quiz-manage.js
Page({
  data: {
    quizList: [],
    currentQuiz: null,
    showQuizForm: false,
    formData: {
      title: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      score: 1,
      category: '',
      difficulty: 'normal'
    }
  },

  onLoad() {
    this.loadQuizList();
  },

  async loadQuizList() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQuizList',
        data: { isAdmin: true }
      });
      this.setData({ quizList: res.result.list });
    } catch (err) {
      console.error('加载题目失败：', err);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  showAddForm() {
    this.setData({
      showQuizForm: true,
      currentQuiz: null,
      formData: {
        title: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        score: 1,
        category: '',
        difficulty: 'normal'
      }
    });
  },

  editQuiz(e) {
    const { quiz } = e.currentTarget.dataset;
    this.setData({
      showQuizForm: true,
      currentQuiz: quiz,
      formData: { ...quiz }
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onOptionChange(e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const options = [...this.data.formData.options];
    options[index] = value;
    this.setData({
      'formData.options': options
    });
  },

  async submitQuiz() {
    const { formData, currentQuiz } = this.data;
    if (!this.validateForm()) return;

    try {
      console.log('提交的题目数据：', formData);
      const res = await wx.cloud.callFunction({
        name: 'manageQuiz',
        data: {
          action: currentQuiz ? 'update' : 'add',
          quizId: currentQuiz?._id,
          quizData: formData
        }
      });
      console.log('云函数返回结果：', res);

      if (!res.result.success) {
        throw new Error(res.result.message);
      }

      wx.showToast({
        title: currentQuiz ? '更新成功' : '添加成功',
        icon: 'success'
      });

      this.setData({ showQuizForm: false });
      this.loadQuizList();
    } catch (err) {
      console.error('保存题目失败：', err);
      wx.showToast({
        title: err.message || '保存失败，请重试',
        icon: 'none'
      });
    }
  },

  validateForm() {
    const { title, options, correctAnswer, score } = this.data.formData;
    if (!title || !correctAnswer || !score) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return false;
    }
    if (options.some(opt => !opt)) {
      wx.showToast({
        title: '请填写所有选项',
        icon: 'none'
      });
      return false;
    }
    if (!options.includes(correctAnswer)) {
      wx.showToast({
        title: '正确答案必须是选项之一',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  async deleteQuiz(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这道题目吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await wx.cloud.callFunction({
              name: 'manageQuiz',
              data: {
                action: 'delete',
                quizId: id
              }
            });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.loadQuizList();
          } catch (err) {
            console.error('删除题目失败：', err);
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  hideForm() {
    this.setData({
      showQuizForm: false
    });
  }
});