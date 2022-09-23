<!-- 
tab组件: 
<app-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></app-tabs>
tabs支持的数据格式： ['全部', '待付款'] 或 [{name:'全部'}, {name:'待付款'}]
-->
<template>
	<view v-if="tabs && tabs.length">
		<view class="menu">
			<view class="purchased-tab">
				<view class="purchased-introduce" v-for="(tab, i) in tabs" :class="{'active': value===i}" :key="i" @click="tabClick(i)">
					<view class="item-title" :class="{ 'text-title': value===i }">
						<text class="txt">{{getTabName(tab)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			tabs: Array,
			value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
				type: [String, Number],
				default () {
					return 0
				}
			},
			fixed: Boolean // 是否悬浮,默认false
		},
		computed: {
			lineLift() {
				return 100 / this.tabs.length * (this.value + 1) - 100 / (this.tabs.length * 2) + '%'
			}
		},
		methods: {
			getTabName(tab) {
				return typeof tab === "object" ? tab.name : tab
			},
			tabClick(i) {
				if (this.value != i) {
					this.$emit("input", i);
					this.$emit("change", i);
				}
				this.$emit("on-tab-click", i);
			}
		}
	}
</script>

<style lang="scss">
	.menu {
		position: fixed; //未吸顶之前是绝对定位
		left: 0;
		top: 0;
		width: 100%;
		height: 88upx;
		z-index: 2;
		background-color: blueviolet;
		text-align: center;
		color: black;
		box-shadow: 0upx 1upx 8upx 0upx rgba(196, 196, 196, 0.22);

		.purchased-tab {
			width: 100%;
			height: 100%;
			font-size: 28upx;
			color: #999999;
			background: #ffffff;
			display: flex;
			align-items: center;
			position: relative;

			.purchased-introduce {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;

				&.active,
				&:active {
					font-size: 32upx;
					font-weight: bold;
					color: #000000;
				}

				.item-title {
					display: block;
				}

				.text-title {
					position: relative;
					display: block;

					.txt {
						position: relative;
						z-index: 22;
					}
				}

				.text-title::before {
					content: '';
					display: block;
					width: 43upx;
					height: 15upx;
					background-color: yellow;
					position: absolute;
					left: -14upx;
					bottom: 5upx;
					border-radius: 7upx;
					z-index: 0;
				}
			}
		}
	}
</style>
