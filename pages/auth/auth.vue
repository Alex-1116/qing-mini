<template>
	<view class="auth">
		<view class="iconBox">
			<image class="logo" src="/static/imgs/sun-600.png" mode="aspectFit"></image>
		</view>
		<view class="title">微信授权页面</view>
		<view class="describe">此页面是微信授权页面，点击下方按钮弹出授权或跳转页面</view>
		<block v-if="!hasUserInfo">
			<button class="btn" v-if="canIUseGetUserProfile" @tap="wxGetUserProfile"> 获取头像昵称 </button>
			<button class="btn" v-else open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">点击微信授权</button>
		</block>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import http from '@/api'
	export default {
		data() {
			return {
				hasUserInfo: false,
				canIUseGetUserProfile: false,
			};
		},
		onLoad() {
			// this.getSettingMess();
			if (wx.getUserProfile) {
				this.canIUseGetUserProfile = true
			}
		},
		methods: {
			...mapActions(['login']),
			...mapMutations(['updateWxUserInfo']),
		
			// 初始化页面,执行查看已授权信息
			getSettingMess() {
				let that = this
				// 获取已授权类别
				uni.getSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							console.log("userInfo用户信息功能已授权")
							console.log(JSON.stringify(that.userInfo))
							// 如果已授权,直接获取对应参数
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									console.log("------------------- ", JSON.stringify(infoRes))
									that.updateWxUserInfo(infoRes.userInfo);
								}
							});
						} else if (!res.authSetting['scope.userInfo']) {
							// 说明此时要获取的用户信息尚未授权,
							// 则设置进入页面时主动弹出，直接授权
							// 由于微信小程序API修改，用户信息授权无法直接弹出，只能通过点击按钮实现授权操作
							// 这里调用授权
							console.log("当前用户信息未授权");
						}
					},
					fail() {
						console.log("获取授权信息授权失败")
					}
				})
			},
			
			// 获取头像昵称
			wxGetUserProfile(e) {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				let that = this
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						that.updateWxUserInfo(res.userInfo);
						console.log('用户昵称为：' + res.userInfo.nickName);
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								uni.showLoading({
									title: "授权中...",
									mask: true
								})
								let params = {
									nickName: res.userInfo.nickName,
									avatarUrl: res.userInfo.avatarUrl,
									code: loginRes.code
								}
								that.login(params).then(res => {
									if (res.code == 0) {
										uni.hideLoading()
										uni.reLaunch({
											url: '../tabbar/index/index'
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: res.message
										});
										uni.hideLoading()
									}
								}).catch(err => {
									console.log(JSON.stringify(err))
									uni.hideLoading()
								});
							}
						});
						
					}
				})
			},
		
			// 授权获取用户信息
			wxGetUserInfo() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
		
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log('用户昵称为：' + infoRes.userInfo.nickName);
								that.updateWxUserInfo(infoRes.userInfo);
								uni.showLoading({
									title: "授权中...",
									mask: true
								})
								let params = {
									nickName: infoRes.userInfo.nickName,
									avatarUrl: infoRes.userInfo.avatarUrl,
									code: loginRes.code
								}
								that.login(params).then(res => {
									if (res.code == 0) {
										uni.hideLoading()
										uni.reLaunch({
											url: '../tabbar/index/index'
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: res.message
										});
										uni.hideLoading()
									}
								}).catch(err => {
									console.log(JSON.stringify(err))
									uni.hideLoading()
								});
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: table;
	}

	.auth {
		margin-top: 0;
		text-align: center;
		display: table-cell;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		padding: 100rpx;
		vertical-align: middle;
	}

	.iconBox {
		border-radius: 50%;
		border: 1px solid #fff;
		background-color: #fff;
		margin: 0 auto 60rpx;
		width: 200rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.logo {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}

	.iconweixin {
		font-size: 80rpx;
		color: #19be6b;
	}

	.title {
		display: inline-block;
		width: 100%;
		margin: 0 0 60rpx;
	}

	.describe {
		color: #a7aaa9;
		font-size: 26rpx;
		margin: 0 0 60rpx;
		border-radius: 50%;
		text-align: center;
		display: inline-block;
		width: 100%;
	}

	.btn {
		padding: 0 60rpx;
		background-color: #19be6b;
		margin: 20rpx 0 200rpx;
		text-align: center;
		vertical-align: middle;
		touch-action: manipulation;
		cursor: pointer;
		background-image: none;
		white-space: nowrap;
		user-select: none;
		font-size: 14px;
		border: 0 !important;
		position: relative;
		text-decoration: none;
		height: 44px;
		line-height: 44px;
		box-shadow: inset 0 0 0 1px #19be6b;
		background: #fff !important;
		color: #19be6b !important;
		display: inline-block;
		border-radius: 10rpx;
	}
</style>
