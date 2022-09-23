<template>
	<view class="foodListContainer">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" top="0" height="100%" :down="downOption" @down="downCallback"
		 :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<view class="food__item" v-for="(f, index) in foodData" :key="index">
				<side-slip style="width: 100%; height: 100%;" @remove="onRemove(f)">
					<view class="food__text Lefted">{{f.name}}</view>
				</side-slip>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import http from '@/api';
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'; // 注意.vue后缀不能省
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
	import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item.js';
	//侧滑
	import SideSlip from '@/components/side-slip/index'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollBody,
			'side-slip': SideSlip
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '暂无数据' // 提示
						// btnText: '去看看'
					}
				},
				foodData: []
			};
		},
		onLoad() {

		},
		methods: {
			getData(pageNum = '', pageSize = '') {
				let params = {
					pageNo: pageNum,
					pageSize: pageSize
				};
				http.mineFoodDataApi(params).then(res => {
					if (res.code == 0) {
						// 接口返回的当前页数据列表 (数组)
						let curPageData = res.result.rows;
						// 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
						let curPageLen = curPageData.length;
						// 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
						// let totalPage = res.result.current;
						// 接口返回的总数据量(如列表有26个数据,每页10条,共3页; 则totalSize=26)
						let totalSize = res.result.count;
						// 接口返回的是否有下一页 (true/false)
						// let hasNext = res.result.searchCount;
						//设置列表数据
						this.mescroll.endSuccess(curPageData.length);

						if (pageNum == 1) {
							this.foodData = []; //如果是第一页需手动置空列表
						}
						this.foodData = this.foodData.concat(curPageData); //追加新数据
					} else {
						uni.showToast({
							icon: 'none',
							title: res.result.message
						});
					}
				}).catch(err => {
					this.mescroll.endErr();
					console.log(JSON.stringify(err));
				});
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				let _self = this;
				setTimeout(function() {
					_self.getData(page.num, page.size);
				}, 1000);
			},
			//点击空布局按钮的回调
			emptyClick() {

			},

			onRemove(item) {
				let params = {
					foodId: item.id
				};
				http.delFoodApi(params).then(res => {
					if (res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '删除成功'
						});
						this.mescroll.resetUpScroll();
					} else {
						uni.showToast({
							icon: 'none',
							title: '删除失败'
						});
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: '删除失败'
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f6;
	}

	.foodListContainer {
		padding: 0 30upx;

		.food__item {
			width: 100%;
			height: 100upx;
			background-color: #ffffff;
			border-radius: 15upx;
			margin: 20upx 0;

			.food__text {
				width: 100%;
				height: 100upx;
				padding: 0 24upx;
				box-sizing: border-box;
			}
		}
	}
</style>
