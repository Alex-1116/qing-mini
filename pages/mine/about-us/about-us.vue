<template>
	<view class="aboutUsContainer">
		<view class="logo-box">
			<image class="logo" src="/static/imgs/sun-600.png" mode=""></image>
			<view class="title FW500">今天吃啥吖</view>
			<view class="title FW500">~ What's for today ~</view>
			<!-- <view class="version">Version 1.0.0</view> -->
		</view>
		<view class="main Centered">
			<view class="title">欢迎使用今天吃啥吖平台</view>
		</view>
		<view class="footer">
			<view class="text">今天吃啥吖平台 版权所有</view>
			<view class="copyright">Copyright © 2021 今天吃啥吖. All Rights Reserved.</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.aboutUsContainer {
		.logo-box {
			margin-bottom: 70upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.logo {
				width: 130upx;
				height: 130upx;
				border-radius: 30upx;
				box-shadow: 0upx 0upx 20upx 0upx rgba(16, 220, 184, 0.5);
				margin: 70upx 0;
			}

			.title {
				font-size: 40upx;
				color: #0D243C;
			}

			.version {
				font-size: $font-size-28;
				color: #0D243C;
			}
		}

		.main {
			padding: 0 40upx;

			.item:first-child {
				border-top: 1upx solid $border-color-ee;
			}

			.item {
				width: 100%;
				height: 110upx;
				border-bottom: 1upx solid $border-color-ee;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.label {
					font-size: $font-size-28;
					color: $font-color-darkGrey;
					font-weight: 500;
				}

				.iconjinru1 {
					font-size: $font-size-28;
					color: $font-color-lightGrey;
					margin: 0 20upx;
				}
			}
			
			.title{
				font-size: $font-size-32;
				color: $font-color-black;
				font-weight: bold;
				margin: 100upx 0;
			}
		}

		.footer {
			width: 100%;
			position: fixed;
			bottom: 50upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding-bottom: constant(safe-area-inset-bottom);
			/*兼容 IOS<11.2*/
			padding-bottom: env(safe-area-inset-bottom);
			/*兼容 IOS>11.2*/

			.agreement {
				font-size: $font-size-24;
				color: #5c6b91;
				margin-bottom: 20upx;
			}

			.text {
				font-size: $font-size-24;
				color: $font-color-lightGrey;
			}

			.copyright {
				font-size: $font-size-24;
				color: $font-color-lightGrey;
			}
		}
	}
</style>
