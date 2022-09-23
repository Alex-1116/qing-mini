<template>
	<view class="editFoodContainer">
		<view class="food__iAdded">
			<view class="food__item Lefted" v-for="(m, index) in meAddedData" :key="index" @click="handleFoodOneClick(m)">
				<view class="food__name">{{m.name}}</view>
				<view class="iconfont iconcha"></view>
			</view>
			<view class="food__tips Centered" v-if="meAddedData.length < 8">点击下方选择8种食物，返回首页，重新绘制专属转盘</view>
		</view>
		<view class="food__content">
			<view class="tabs__box Lefted">
				<view class="tabs__item" :class="{'tabs-active': current === index}" v-for="(t, index) in tabs" :key="index" @click="handleTabClick(index)">
					<text :class="{'text-active': current === index}">{{t.title}}</text>
				</view>
			</view>
			<view class="swiper__box">
				<swiper class="swiper__container" :current="current" :interval="interval" :duration="duration" @change="swiperChange">
					<swiper-item>
						<view class="swipe__item">
							<view class="food__oneBox">
								<view class="food__one Centered" :class="{'food-active': meAddedIds.indexOf(s.id) > -1}" v-for="(s, index) in sysFoodData"
								 :key="index" @click="handleFoodOneClick(s)">{{s.name}}</view>
							</view>
							<view class="food__refresh Centered" @click="handleRefreshFood">
								<view class="iconfont iconshuaxin1"></view>
								<view class="food__text">换一批</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swipe__item">
							<view class="food__oneBox">
								<view class="food__one Centered" :class="{'food-active': meAddedIds.indexOf(m.id) > -1}" v-for="(m, index) in mineFoodData"
								 :key="index" @click="handleFoodOneClick(m)">{{m.name}}</view>
							</view>
							<view class="food__refresh Centered" @click="handleRefreshFood">
								<view class="iconfont iconshuaxin1"></view>
								<view class="food__text">换一批</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="footer__box Centered">
			<button class="btn-edit btn-active Centered" @click="goCreateFood">创建食物</button>
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
				fromPath: '',
				meAddedData: [],
				meAddedIds: [],
				interval: 2000,
				duration: 1000,
				current: 0, // 当前活跃的swiper-item的index
				tabs: [{
					title: '热门食物'
				}, {
					title: '我创建的'
				}],
				sysFoodData: [],
				sysTotal: 0,
				sysPageNo: 1,
				sysPageSize: 10,
				mineFoodData: [],
				mineTotal: 0,
				minePageNo: 1,
				minePageSize: 10,
			};
		},
		computed: {
			...mapState({
				oldMeAddedIds: store => store.app.oldMeAddedIds
			})
		},
		onLoad(options) {
			uni.$on('notice-editFood', data => {
				this.current = 1;
				this.getMineFoodData();
			})
			this.fromPath = options.fromPath;
			this.getMeAddedFoodData();
			this.getSysFoodData();
			this.getMineFoodData();
		},
		onUnload() {
			uni.$off('notice-editFood')
			// 返回通知上一页从新绘制转盘
			// onBackPress 只支持APP和H5 但不支持小程序 ，可以用onUnload生命周期解决，页面销毁的时候执行方法。
			if (this.fromPath == 'homeIndex') {
				let includes = util.includesLocal(this.oldMeAddedIds, this.meAddedIds)
				if (!includes) {
					uni.$emit('notice-index')
				}
			} else {
				uni.$emit('notice-myFood', {fromPath: 'editFoodIndex'})
			}
		},
		methods: {
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
						this.$store.commit('updateOldMeAddedIds', JSON.parse(JSON.stringify(this.meAddedIds)))
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

			handleTabClick(index) {
				this.current = index;
				if (this.current == 0) {
					this.getSysFoodData()
				} else {
					this.getMineFoodData()
				}
			},

			swiperChange(e) {
				let current = e.detail.current;
				this.current = current;
				if (this.current == 0) {
					this.getSysFoodData()
				} else {
					this.getMineFoodData()
				}
			},

			// 获取系统默认
			getSysFoodData() {
				let params = {
					pageNo: this.sysPageNo,
					pageSize: this.sysPageSize
				}
				http.sysFoodDataApi(params).then(res => {
					if (res.code == 0) {
						this.sysFoodData = res.result.rows;
						this.sysTotal = res.result.count;
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

			// 获取我创建的
			getMineFoodData() {
				let params = {
					pageNo: this.minePageNo,
					pageSize: this.minePageSize
				}
				http.mineFoodDataApi(params).then(res => {
					if (res.code == 0) {
						this.mineFoodData = res.result.rows;
						this.mineTotal = res.result.count;
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

			handleRefreshFood() {
				if (this.current == 0) {
					if (this.sysPageNo * this.sysPageSize < this.sysTotal) {
						this.sysPageNo++
					} else {
						this.sysPageNo = 1
					}
					this.getSysFoodData()
				} else {
					if (this.minePageNo * this.minePageSize < this.mineTotal) {
						this.minePageNo++
					} else {
						this.minePageNo = 1
					}
					this.getMineFoodData()
				}
			},

			handleFoodOneClick(item) {
				let params = {
					foodId: item.id,
					isSelect: this.meAddedIds.indexOf(item.id) > -1 ? 0 : 1
				}
				if (params.isSelect == 1 && this.meAddedIds.length == 8) {
					uni.showToast({
						icon: 'none',
						title: '转盘最多可添加8条数据'
					});
					return
				}
				http.updateIsSelectApi(params).then(res => {
					if (res.code == 0) {
						if (params.isSelect == 0) {
							this.meAddedData.splice(this.meAddedData.findIndex(m => m.id === item.id), 1)
							this.meAddedIds.splice(this.meAddedIds.findIndex(m => m === item.id), 1)
						} else {
							this.meAddedData.push(item)
							this.meAddedIds.push(item.id)
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

			goCreateFood() {
				uni.navigateTo({
					url: '../create_food/create_food'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		background-color: #fafafa;
	}

	.editFoodContainer {
		width: 100%;
		height: 100%;

		.food__iAdded {
			width: 100%;
			height: 510upx;
			border-top: 1upx solid $border-color-ee;
			padding: 35upx 50upx;
			box-sizing: border-box;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			flex-wrap: wrap;
			position: relative;

			.food__item {
				width: auto;
				height: 76upx;
				background-color: #77b1f6;
				padding: 0 35upx;
				border-radius: 38upx;
				margin-right: 24upx;
				margin-bottom: 16upx;

				.food__name {
					font-size: $font-size-24;
					color: $font-color-white;
					margin-right: 15upx;
				}

				.iconcha {
					font-size: $font-size-24;
					color: $font-color-white;
				}
			}
			
			.food__tips{
				width: 100%;
				position: absolute;
				left: 0;
				bottom: 35upx;
				font-size: $font-size-26;
				font-weight: 500;
				color: #eeeeee;
			}
		}

		.food__content {
			width: 100%;
			height: calc(100% - 620upx);
			background-color: $block-bg-white;

			.tabs__box {
				width: 100%;
				height: 105upx;
				border-bottom: 1upx solid $border-color-ee;
				padding: 0 50upx;
				box-sizing: border-box;

				.tabs__item {
					font-size: $font-size-28;
					color: #282828;
					margin-right: 50upx;

					.text-active {
						position: relative;
						transition: .3s;
					}

					.text-active:after {
						content: '';
						width: 48upx;
						height: 6upx;
						background-color: #66d0ce;
						border-radius: 3upx;
						position: absolute;
						left: 50%;
						margin-left: -24upx;
						bottom: -20upx;
					}
				}

				.tabs-active {
					font-size: $font-size-28;
					font-weight: bold;
					color: #282828;
				}
			}

			.swiper__box {
				width: 100%;
				height: calc(100% - 105upx);

				.swiper__container {
					width: 100%;
					height: 100%;
					overflow: hidden;
				}

				.swipe__item {
					width: 100%;
					height: 100%;
					overflow-y: scroll;
				}

				.food__oneBox {
					width: 100%;
					height: 100%;
					overflow-y: scroll;
					padding: 30upx 50upx 0;
					box-sizing: border-box;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					align-content: flex-start;
					flex-wrap: wrap;
				}

				.food__one {
					width: auto;
					height: 76upx;
					padding: 0 35upx;
					background-color: #f7f7f7;
					border-radius: 38upx;
					margin-right: 16upx;
					margin-bottom: 12upx;
					font-size: $font-size-24;
					color: #282828;
				}

				.food-active {
					background-color: #77b1f6;
					color: #ffffff;
				}

				.food__refresh {
					width: 100%;
					height: 80upx;
					padding-bottom: constant(safe-area-inset-bottom);
					/*兼容 IOS<11.2*/
					padding-bottom: env(safe-area-inset-bottom);
					/*兼容 IOS>11.2*/

					.iconshuaxin1 {
						font-size: 24upx;
						color: #66d0ce;
						margin-right: 10upx;
					}

					.food__text {
						font-size: $font-size-24;
						color: #66d0ce;
					}
				}
			}
		}

		.footer__box {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 110upx;
			background-color: $block-bg-white;
			border-top: 1upx solid $border-color-ee;
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
