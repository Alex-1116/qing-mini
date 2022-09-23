<template>
	<view class="myFoodContainer">
		<view class="header__box" :style="{'height':`${statusBarHeight * 2 + 88}rpx`}">
			<view class="status__bar" :style="{'height':`${statusBarHeight * 2}rpx`}"></view>
			<view class="navigate__box Lefted">
				<view class="iconfont iconfanhui" @click="back"></view>
			</view>
		</view>
		<image class="myFood__bg" src="/static/imgs/myfood-bg02.jpg" mode=""></image>
		<view class="food__title Lefted">我的食物</view>
		<view class="food__content">
			<view class="food__item Centered" v-for="(m, index) in meAddedData" :key="index">{{m.name}}</view>
		</view>
		<view class="footer__box Centered">
			<button class="btn-edit btn-active Centered" @click="goEditFood">编辑食物</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import http from '@/api';
	import util from '@/common/utils/util.js'
	export default {
		data() {
			return {
				statusBarHeight: getApp().globalData.$statusBarHeight, //状态栏高度
				meAddedData: [],
				meAddedIds: [],
				fromPath: ''
			};
		},
		computed: {
			...mapState({
				oldMeAddedIds: store => store.app.oldMeAddedIds
			})
		},
		onLoad() {
			uni.$on('notice-myFood', data => {
				this.fromPath = data.fromPath
			})
			this.getMeAddedFoodData()
		},
		onShow() {
			this.getMeAddedFoodData()
		},
		onUnload() {
			uni.$off('notice-myFood')
			// 返回通知上一页从新绘制转盘
			// onBackPress 只支持APP和H5 但不支持小程序 ，可以用onUnload生命周期解决，页面销毁的时候执行方法。
			let includes = util.includesLocal(this.oldMeAddedIds, this.meAddedIds)
			if (!includes) {
				uni.$emit('notice-index')
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},

			// 获取我选中
			getMeAddedFoodData() {
				let params = {
					isSelect: 1
				}
				http.meAddedFoodDataApi(params).then(res => {
					if (res.code == 0) {
						this.meAddedData = res.result;
						this.meAddedIds = this.meAddedData.map(item => {
							return item.id
						})
						if (this.fromPath == 'editFoodIndex') {
							
						} else {
							this.$store.commit('updateOldMeAddedIds', JSON.parse(JSON.stringify(this.meAddedIds)))
						}
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

			goEditFood() {
				uni.navigateTo({
					url: `../edit_food/edit_food?fromPath=${'myFoodIndex'}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgba(194, 204, 206, 0.8);
	}

	.myFoodContainer {
		height: 100%;
		background: rgba(194, 204, 206, 0.8);

		.myFood__bg {
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			filter: blur(20px);
		}

		.header__box {
			width: 100%;

			.status__bar {
				width: 100%;
			}

			.navigate__box {
				width: 100%;
				height: 88upx;
				padding: 0 24upx;
				box-sizing: border-box;

				.iconfanhui {
					font-size: 36upx;
					font-weight: 500;
					color: #ffffff;
				}
			}
		}

		.food__title {
			width: 100%;
			height: 160upx;
			font-size: 52upx;
			font-weight: 500;
			color: $font-color-black;
			margin-top: 76upx;
			padding: 0 50upx;
			box-sizing: border-box;
		}

		.food__content {
			width: 100%;
			height: auto;
			padding: 0 50upx;
			box-sizing: border-box;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;

			.food__item {
				width: auto;
				height: 84upx;
				font-size: $font-size-28;
				color: $font-color-darkGrey;
				background-color: #fafafa;
				border-radius: 20upx;
				padding: 0 40upx;
				margin-right: 16upx;
				margin-bottom: 16upx;
			}
		}

		.footer__box {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 110upx;
			padding-bottom: constant(safe-area-inset-bottom);
			/*兼容 IOS<11.2*/
			padding-bottom: env(safe-area-inset-bottom);
			/*兼容 IOS>11.2*/

			.btn-edit {
				width: calc(100% - 100upx);
				height: 78upx;
				background-color: rgba(255, 255, 255, 0.6);
				border: 1upx solid #66d0ce;
				border-radius: 39upx;
				font-size: $font-size-28;
				font-weight: 500;
				color: #66d0ce;
			}
		}
	}
</style>
