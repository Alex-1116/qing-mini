<template>
	<view class="mineContainer">
		<view class="mine__box" :style="[{
			'padding-top': `${statusBarHeight * 2 + 88}rpx`,
			'padding-right': `${24}rpx`,
			'padding-bottom': `${statusBarHeight * 2 + 88}rpx`,
			'padding-left': `${24}rpx`,
		}]">
			<image class="mine__bg" src="/static/imgs/mine-bg.jpg" mode="widthFix"></image>
			<view class="mine__info">
				<view class="mine__headContainer">
					<image class="mine__head" :src="wxUserInfo.avatarUrl ? wxUserInfo.avatarUrl : '/static/imgs/user-unlogin.png'"
					 mode=""></image>
				</view>
				<view class="mine__nameBox Centered">
					<view class="nikeName">{{wxUserInfo.nickName ? wxUserInfo.nickName : ''}}</view>
					<button class="btn-sq btn-active Centered" v-if="!wxUserInfo.nickName">授权登录</button>
				</view>
			</view>
			<view class="today__block Lefted">{{signTitle}}</view>
		</view>
		<view class="options__box">
			<view class="options__item Lefted" @click="goFoodList">
				<view class="iconfont iconic_item_food"></view>
				<view class="options__title">我创建的食物</view>
				<view class="iconfont iconjinru1"></view>
			</view>
			<view class="options__item Lefted" @click="goAboutUs">
				<view class="iconfont iconguanyu"></view>
				<view class="options__title">关于我们</view>
				<view class="iconfont iconjinru1"></view>
			</view>
		</view>
		<!-- button -->
		<!-- <button class="btn-mask" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true" v-if="maskStatus == 1"></button> -->
		<button class="btn-mask" v-if="!wxUserInfo.nickName" @click="goAuth" ></button>
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
				statusBarHeight: getApp().globalData.$statusBarHeight, //状态栏高度
				maskStatus: null,
				signTitle: 'welcome to ···'
			};
		},
		computed: {
			...mapState({
				wxUserInfo: store => store.user.wxUserInfo,
				isLogin: store => store.user.isLogin,
			})
		},
		onLoad() {
			
		},
		onShow() {
			// this.getSettingMess();
			if (this.isLogin) {
				this.getSign();
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
									that.maskStatus = null
								}
							});
						} else if (!res.authSetting['scope.userInfo']) {
							// 说明此时要获取的用户信息尚未授权,
							// 则设置进入页面时主动弹出，直接授权
							// 由于微信小程序API修改，用户信息授权无法直接弹出，只能通过点击按钮实现授权操作
							// 这里调用授权
							console.log("当前用户信息未授权");
							that.maskStatus = 1
						}
					},
					fail() {
						console.log("获取授权信息授权失败")
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
								let params = {
									nickName: infoRes.userInfo.nickName,
									avatarUrl: infoRes.userInfo.avatarUrl,
									code: loginRes.code
								}
								that.login(params).then(res => {
									if (res.code == 0) {
										that.maskStatus = null;
										that.getSign();
									} else {
										uni.showToast({
											icon: 'none',
											title: res.message
										});
									}
								}).catch(err => {
									console.log(JSON.stringify(err))
								});
							}
						});
					}
				});
			},
			
			getSign() {
				http.signApi().then(res => {
					if (res.code == 0) {
						this.signTitle = res.result
					} else {
						uni.showToast({
							icon: 'none',
							title: res.message
						});
					}
				}).catch(err => {
					console.log(JSON.stringify(err))
				});
			},
			
			goAuth() {
				uni.reLaunch({
					url: '../../auth/auth'
				})
			},

			goFoodList() {
				uni.navigateTo({
					url: "../../mine/food-list/food-list"
				})
			},

			goAboutUs() {
				uni.navigateTo({
					url: '../../mine/about-us/about-us'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $page-bg-f6;
	}

	.mineContainer {
		.mine__box {
			width: 100%;
			height: 750upx;
			// padding: 128upx 24upx;
			box-sizing: border-box;
			// background: linear-gradient(to bottom, #87a3f8, #bacefa);
			border-radius: 0 0 100upx 100upx;
			margin-bottom: 20upx;
			position: relative;
			
			.mine__bg{
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: auto;
			}

			.mine__info {
				width: 100%;
				height: auto;
				padding: 60upx 20upx;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.mine__headContainer {
					width: 160upx;
					height: 160upx;

					.mine__head {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.mine__nameBox {
					width: 100%;
					height: 100upx;

					.nikeName {
						font-size: $font-size-32;
						font-weight: 500;
						color: $font-color-white;
					}

					.btn-sq {
						width: 168upx;
						height: 66upx;
						font-size: $font-size-28;
						color: $font-color-white;
						border-radius: 30upx;
						border: 1upx solid #ffffff;
						background-color: transparent;
						margin-top: 10upx;
					}
				}
			}

			.today__block {
				position: absolute;
				left: 50upx;
				bottom: 100upx;
				background: rgba(255,255,255, 0.5);
				width: 420upx;
				height: 120upx;
				border-radius: 30upx;
				font-size: $font-size-28;
				color: $font-color-white;
				padding: 0 20upx;
				box-sizing: border-box;
			}
		}

		.options__box {
			padding: 0 20upx;
			box-sizing: border-box;
			background-color: $block-bg-white;

			.options__item {
				width: 100%;
				height: 100upx;
				border-bottom: 1upx solid $border-color-ee;
				
				.iconic_item_food,
				.iconguanyu{
					font-size: 36upx;
				}
				
				.iconic_item_food{
					color: #E04B28;
				}
				
				.iconguanyu{
					color: #87a3f8;
				}
				
				.options__title{
					flex: 1;
					font-size: $font-size-28;
					font-weight: 500;
					color: $font-color-black;
					padding: 0 15upx;
				}
				
				.iconjinru1{
					font-size: 28upx;
					color: $font-color-lightGrey;
				}
			}

			.options__item:last-child {
				border-bottom: none;
			}
		}

		.options__box--bottom {
			margin-bottom: 20upx;
		}

		.btn-mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0);
			border: none;
		}
	}
</style>
