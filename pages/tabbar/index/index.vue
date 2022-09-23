<template>
	<view class="home">
		<image class="home__bg" src="/static/imgs/index-bg.png" mode=""></image>
		<view class="home-title">
			<text class="home-title__text wenyue-font">日落归山海</text>
		</view>
		<view class="home-wheel">
			<almost-lottery :prize-list="prizeList" :ring-count="2" :duration="1" :canvas-width="canvasData.width"
			 :canvas-height="canvasData.height" :prize-index="prizeIndex" @reset-index="prizeIndex = -1" @draw-start="handleDrawStart"
			 @draw-end="handleDrawEnd" @finish="handleDrawFinish" v-if="prizeList.length" />
			<text class="almost-lottery__tip" v-else>食物准备中...</text>
		</view>
		<view class="home-footer">
			<view class="home-result">
				<text class="home-result__text">{{ targetName }}</text>
			</view>
			<view class="home-action">
				<!-- <button class="btn__action btn-active btn__action--yellow" @tap="handleInitCanvas">重新生成-测试用</button> -->
				<view class="icon__box Lefted">
					<button class="btn__action btn-active btn__action--yellow01 Centered" @click="checkLogin(goEditFood)">
						<view class="btn__text Centered">添加食物</view>
					</button>
					<button class="btn__action btn-active btn__action--yellow02 Centered" @click="checkLogin(goMyFood)">
						<view class="btn__text Centered">我的食物</view>
						<view class="iconfont iconjinru1 Centered"></view>
					</button>
					<!-- <view class="iconfont iconiconjia Centered" @click="goEditFood"></view>
					<view class="iconfont iconjinru1 Centered" @click="goMyFood"></view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import http from '@/api'
	import AlmostLottery from '@/components/almost-lottery/almost-lottery.vue'
	import {
		clearCacheFile
	} from '@/almost-utils/almost-utils.js'
	export default {
		name: 'Home',
		components: {
			AlmostLottery
		},
		data() {
			return {
				// canvas 宽高
				canvasData: {
					width: 240,
					height: 240
				},
				// 奖品数据
				prizeList: [],
				// 中奖下标
				prizeIndex: -1,
				// 是否正在抽奖中
				prizeing: false,
				// 中奖类目名称
				targetName: '',
				// 奖品是否设有库存
				onStock: true,
				// 是否由前端控制概率，默认不开启
				onFrontend: false,
				// 权重随机数的最大值
				weightTotal: 0,
				// 权重数组
				weightArr: [],
				// emoji
				emojiData: [{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/grinning-face-with-big-eyes_1f603.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/grinning-squinting-face_1f606.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/smiling-face-with-heart-eyes_1f60d.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/zany-face_1f92a.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/star-struck_1f929.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/nerd-face_1f913.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/face-with-monocle_1f9d0.png'
				},{
					emojiUrl: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/samsung/265/drooling-face_1f924.png'
				}]
			}
		},
		computed: {
			...mapState({
				isLogin: store => store.user.isLogin
			})
		},
		onLoad() {
			// 监听事件
			// 由于您选择的食物发生变化，系统会自动更新首页转盘列表，并重新绘制转盘
			uni.$on('notice-index', data => {
				this.handleInitCanvas();
			})
			// 模拟请求奖品数据
			this.getPrizeList()
		},
		onUnload() {
			uni.$off('notice-index')
			uni.hideLoading()
		},
		methods: {
			// 重新生成
			handleInitCanvas() {
				clearCacheFile()

				this.targetName = ''
				this.prizeList = []
				this.getPrizeList()

			},
			// 获取奖品列表
			// async getPrizeList() {
			// 	uni.showLoading({
			// 		title: '菜品准备中...'
			// 	})

			// 	let res = await this.requestPrizeList()
			// 	console.log('获取奖品列表', res)

			// 	if (res.ok) {
			// 		let data = res.data
			// 		if (data.length) {
			// 			// stock 奖品库存
			// 			// weight 中奖概率，数值越大中奖概率越高
			// 			this.prizeList = data

			// 			// 如果开启了前端控制概率
			// 			// 计算出权重的总和并生成权重数组
			// 			if (this.onFrontend) {
			// 				this.prizeList.forEach((item) => this.weightTotal += item.weight)
			// 				this.weightArr = this.prizeList.map((item) => item.weight)
			// 			}
			// 		}
			// 	} else {
			// 		uni.hideLoading()
			// 		uni.showToast({
			// 			title: '获取奖品失败'
			// 		})
			// 	}
			// },
			// // 模拟请求奖品列表接口
			// requestPrizeList() {
			// 	return new Promise((resolve, reject) => {
			// 		let requestTimer = setTimeout(() => {
			// 			clearTimeout(requestTimer)
			// 			requestTimer = null

			// 			resolve({
			// 				ok: true,
			// 				data: [{
			// 						prizeId: 1,
			// 						name: '饺子',
			// 						stock: 100,
			// 						weight: 0,
			// 						prizeImage: '/static/lottery-prize/git.png'
			// 					},
			// 					{
			// 						prizeId: 2,
			// 						name: '麻辣烫',
			// 						stock: 100,
			// 						weight: 0,
			// 						prizeImage: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/56f085e0-bcfe-11ea-b244-a9f5e5565f30.png'
			// 					},
			// 					{
			// 						prizeId: 3,
			// 						name: '石板石锅',
			// 						stock: 100,
			// 						weight: 0
			// 					},
			// 					{
			// 						prizeId: 4,
			// 						name: '过桥米线',
			// 						stock: 100,
			// 						weight: 0
			// 					},
			// 					{
			// 						prizeId: 5,
			// 						name: '黄焖鸡米饭',
			// 						stock: 100,
			// 						weight: 0
			// 					},
			// 					{
			// 						prizeId: 6,
			// 						name: '混沌',
			// 						stock: 100,
			// 						weight: 0
			// 					},
			// 					{
			// 						prizeId: 7,
			// 						name: '不吃了~',
			// 						stock: 100,
			// 						weight: 0
			// 					},
			// 					{
			// 						prizeId: 8,
			// 						name: '酸菜五花肉',
			// 						stock: 100,
			// 						weight: 0
			// 					}
			// 				]
			// 			})
			// 		}, 2000)
			// 	})
			// },

			// 获取奖品列表
			async getPrizeList() {
				uni.showLoading({
					title: '食物准备中...'
				})

				let res = await this.requestPrizeList()
				console.log('获取奖品列表', res)

				if (res.code == 0) {
					let newData = res.result.rows;
					// newData.forEach((el, index) => {
					// 	el.prizeImage = this.emojiData[index].emojiUrl
					// })
					let data = newData.map(item => {
						return {
							prizeId: item.id,
							name: item.name,
							stock: item.stock,
							weight: item.weight,
							// prizeImage: item.prizeImage
						}
					})

					if (data.length) {
						// stock 奖品库存
						// weight 中奖概率，数值越大中奖概率越高
						this.prizeList = data

						// 如果开启了前端控制概率
						// 计算出权重的总和并生成权重数组
						if (this.onFrontend) {
							this.prizeList.forEach((item) => this.weightTotal += item.weight)
							this.weightArr = this.prizeList.map((item) => item.weight)
						}
					}
				} else {
					uni.hideLoading()
					uni.showToast({
						title: '获取奖品失败'
					})
				}
			},
			// 模拟请求奖品列表接口
			requestPrizeList() {
				return new Promise((resolve, reject) => {
					let requestTimer = setTimeout(() => {
						clearTimeout(requestTimer)
						requestTimer = null

						let params = {
							isSelect: 1 // 0:用户未添加，1:用户已添加
						}
						http.prizeFoodApi(params).then(res => {
							if (res.code == 0) {
								resolve(res)
							} else {
								uni.showToast({
									icon: 'none',
									title: res.message
								});
								reject(res)
							}
						}).catch(err => {
							console.log(JSON.stringify(err))
							reject(err)
						});

					}, 2000)
				})
			},

			// 本次抽奖开始
			handleDrawStart() {
				if (this.prizeing) return
				this.prizeing = true

				this.targetName = ''

				let list = [...this.prizeList]

				// 判断是否由前端控制概率
				// 前端控制概率的情况下，需要拿到最接近随机权重且大于随机权重的值
				// 后端控制概率的情况下，通常会直接返回 prizeId
				if (this.onFrontend) {
					if (!this.weightTotal) {
						console.warn('###当前已开启前端控制中奖概率，但是奖品数据列表中的 weight 参数似乎配置不正确###')
						return
					}
					console.warn('###当前处于前端控制中奖概率，安全起见，强烈建议由后端控制###')
					console.log('当前权重总和为 =>', this.weightTotal)

					// 注意这里使用了 Math.ceil，如果某个权重的值为 0，则始终无法中奖
					let weight = Math.ceil(Math.random() * this.weightTotal)
					console.log('本次权重随机数 =>', weight)

					// 生成大于等于随机权重的数组
					let tempMaxArrs = []
					list.forEach((item) => {
						if (item.weight >= weight) {
							tempMaxArrs.push(item.weight)
						}
					})

					// 如果大于随机权重的数组有值，先对这个数组排序然后取值
					// 反之新建一个临时的包含所有权重的已排序数组，然后取值
					if (tempMaxArrs.length) {
						tempMaxArrs.sort((a, b) => a - b)
						this.prizeIndex = this.weightArr.indexOf(tempMaxArrs[0])
					} else {
						let tempWeightArr = [...this.weightArr]
						tempWeightArr.sort((a, b) => a - b)
						this.prizeIndex = this.weightArr.indexOf(tempWeightArr[tempWeightArr.length - 1])
					}

					console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].name)

					// 如果奖品设有库存
					if (this.onStock) {
						console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].stock)
					}
				} else {
					// 模拟请求获取中奖信息
					let stoTimer = setTimeout(() => {
						clearTimeout(stoTimer)
						stoTimer = null

						console.warn('###当前处于模拟的随机中奖概率，实际场景中，中奖概率应由后端控制###')
						// 这里随机产生的 prizeId 是模拟后端返回的 prizeId
						let prizeIdIndex = Math.floor(Math.random() * list.length)

						for (let i = 0; i < list.length; i++) {
							let item = list[i]
							if (item.prizeId === list[prizeIdIndex].prizeId) {
								// 中奖下标
								this.prizeIndex = i
								break
							}
						}

						console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].name)

						// 如果奖品设有库存
						if (this.onStock) {
							console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].stock)
						}
					}, 500)
				}
			},
			// 本次抽奖结束
			handleDrawEnd() {
				this.prizeing = false

				// 旋转结束后，可以执行拿到结果后的逻辑
				let prizeName = this.prizeList[this.prizeIndex].name

				if (this.onStock) {
					let prizeStock = this.prizeList[this.prizeIndex].stock
					this.targetName = prizeName === '不吃了~' ? prizeName : prizeStock ? `恭喜您，选中 ${prizeName}` : '很抱歉，您来晚了，当前食物已无库存'
				}

				this.targetName = prizeName === '不吃了~' ? prizeName : `恭喜您，选中 ${prizeName}`
			},
			// 抽奖转盘绘制完成
			handleDrawFinish(res) {
				console.log('抽奖转盘绘制完成', res)

				uni.showToast({
					title: res.msg,
					duration: 2000,
					mask: true,
					icon: 'none'
				})
			},

			// 校验是否授权登录
			checkLogin(callback) {
				if (!this.isLogin) {
					uni.reLaunch({
						url: '../../auth/auth'
					})
				} else {
					callback()
				}
			},

			goEditFood() {
				uni.navigateTo({
					url: `../../home/edit_food/edit_food?fromPath=${'homeIndex'}`
				})
			},

			goMyFood() {
				uni.navigateTo({
					url: '../../home/my_food/my_food',
					animationType: 'slide-in-bottom',
					animationDuration: 200
				})
			},

			/**
			 * 用户点击右上角分享
			 */
			onShareAppMessage: function(e) {
				let title = '朋友，纠结吗？快来看看今天吃啥吧！'
				return {
					title: title,
					path: 'pages/tabbar/index/index'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$wheelBgUrl: '~static/almost-lottery/almost-lottery__bg';

	.home__bg {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
	}

	.home {
		height: 100%;
		box-sizing: border-box;
	}
	
	.home-title{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.home-title,
	.home-footer{
		width: 100%;
		height: calc((100% - 280px) / 2);
		text-align: center;
	}

	.home-title__text {
		color: #fa563a;
		font-size: 30px;
		font-weight: bold;
		text-shadow: #fbe9b1 1px 0 0, #fbe9b1 0 1px 0, #fbe9b1 -1px 0 0, #fbe9b1 0 -1px 0;
	}

	.home-result {
		width: 100%;
		height: 50%;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.home-result__text {
		color: #fbe9b1;
		font-size: 20px;
		font-weight: bold;
	}

	.home-wheel {
		height: 280px;
		text-align: center;
	}

	.almost-lottery__tip {
		font-size: 24rpx;
	}

	.home-action {
		width: 100%;
		height: 50%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}

	.icon__box {
		height: auto;
		margin-bottom: 20upx;

		.btn__text {
			height: 100%;
			font-size: $font-size-28;
			font-weight: 500;
			color: #FFFFFF;
			margin-right: 10upx;
		}

		.iconiconjia,
		.iconjinru1 {
			height: 100%;
			font-size: 22upx;
			color: $font-color-white;
		}
	}

	.btn__action {
		width: 260rpx;
		height: 80rpx;
		border-radius: 20rpx;
		margin: 0 30upx;
	}

	.btn__action--yellow01 {
		background-color: #f5c043;
		box-shadow: 0 8upx 8upx 0 #fbe9b1;
	}

	.btn__action--yellow02 {
		background-color: #fbaa2a;
		box-shadow: 0 8upx 8upx 0 #fbe9b1;
	}
</style>
