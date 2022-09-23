<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			var app = this.globalData;
			uni.getSystemInfo({
				success: function(e) {
					// 判断市场常见的几种刘海屏机型
					let modelmes = e.model;
					//状态栏高度
					app.$statusBarHeight = e.statusBarHeight;
					app.$screenHeight = e.screenHeight;
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	@import './static/fonts/iconfont.css';
	/* #endif */
	
	@font-face {
	  font-family: "wenyue";
	  src: url('https://qn.oneidea.xyz/RuiZiZhenYanTiMianFeiShangYong-2.ttf');
	}
	
	@font-face {
		font-family: 'neutra';
		src: url('https://static.heytea.com/taro_trial/v1/font/NeutraTextDemiAlt.otf');
	}
	
	.wenyue-font {
		font-family: 'wenyue';
	}
	
	.neutra-font {
		font-family: 'neutra';
	}
	
	.Lefted {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	
	.Centered {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.Righted {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	/* 按钮点击效果 start */
	.btn-active {
		position: relative;
		border: 0upx;
		padding: 0;
		box-sizing: border-box;
		text-decoration: none;
		overflow: visible;
		margin-left: initial;
		transform: translate(0upx, 0upx);
		margin-right: initial;
	}
	
	.btn-active::after {
		display: none;
	}
	
	.btn-active.button-hover {
		transform: translate(1upx, 1upx);
	}
	
	.btn-active[disabled] {
		opacity: 0.6;
		color: #ffffff;
	}
	
	/* 按钮点击效果 end */
</style>
