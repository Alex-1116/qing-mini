import Vue from 'vue';
import http from '@/api'

const user = {
	state: {
		token: uni.getStorageSync("token") ? uni.getStorageSync("token") : "",
		isLogin: uni.getStorageSync("token") ? true : false,
		wxUserInfo: uni.getStorageSync("wxUserInfo") ? uni.getStorageSync("wxUserInfo") : {},
	},
	mutations: {
		updateToken(state, token) {
			state.token = token
			state.isLogin = true
		},
		
		updateWxUserInfo(state, wxUserInfo) {
			state.wxUserInfo = wxUserInfo;
			uni.setStorageSync("wxUserInfo", wxUserInfo)
		},

		logout(state) {
			uni.removeStorageSync('token')
			uni.removeStorageSync('isLogin')
			uni.removeStorageSync('wxUserInfo')
			
			state.token = null
			state.isLogin = false
		}
	},
	actions: {
		login({
			commit,
			state
		}, params) {
			return new Promise((resolve, reject) => {
				http.loginApi(params).then(res => {
					let result = res.result;
					if (res.code == 0) {
						commit('updateToken', result.token)
						uni.setStorageSync("token", result.token)
						resolve(res)
					} else {
						reject(res)
					}
				}).catch(err => {
					reject(err)
				})
			})
		},

		// 退出登陆
		logout({
			commit,
			state
		}, params) {
			return new Promise((resolve, reject) => {
				http.logoutApi(params).then(res => {
					if (res.success) {
						commit('logout')
						resolve(res)
					} else {
						commit('logout')
						reject(res)
					}
				}).catch((err) => {
					commit('logout')
					reject(err)
				});
			})
		}
	},
	getters: {

	}
}

export default user;
