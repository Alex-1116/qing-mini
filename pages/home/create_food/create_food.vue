<template>
	<view>
		<input type="text" value="" focus="true" placeholder="请输入食物名称" class="ipt" v-model="title" maxlength="12" @input='ipt()' />
		<view class="tips">12个字符，可由中英文、数字组成</view>
		<button class="btn btn-active" @click="handleAddFood()">保存</button>
	</view>
</template>

<script>
	import http from '@/api';
	export default {
		data() {
			return {
				title: ''
			};
		},
		onLoad() {},
		methods: {
			// 编辑个人信息，触发返回，进行保存操作
			handleAddFood() {
				// if (this.title == '') {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '请输入食物名称'
				// 	})
				// 	return
				// }
				if (!this.checkName()) {
					return
				}
				let param = {
					name: this.title.trim(),
					type: 2
				}
				http.addFoodApi(param).then(res => {
					if (res.code == 0) {
						this.showModal(this.title)
					} else if (res.code == 100001) {
						uni.showToast({
							icon: 'none',
							title: '您已创建过该食物！'
						})
						this.title = ''
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				}).catch(err => {
					console.log(JSON.stringify(err))
				})
			},
			
			showModal(foodName) {
				let that = this;
				uni.showModal({
					title: '温馨提示',
					content: `恭喜您创建 [${foodName}] 成功`,
					cancelText: "去选择", // 取消按钮的文字  
					confirmText: "继续创建", // 确认按钮文字  
					success: function(res) {
						if (res.confirm) {
							that.title = ''
						} else if (res.cancel) {
							uni.$emit('notice-editFood')
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			},
			
			checkName() {
				let flag = 1;
				//[\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
				let rx = /[a-z\d]/i,
					rxcn = /[\u4e00-\u9fa5]/,
					num = 0,
					chr;
			
				for (let i = 0, j = this.title.length; i < j; i++) {
					chr = this.title.charAt(i);
					if (rx.test(chr)) num += 1;
					else if (rxcn.test(chr)) num += 2;
					else {
						flag = 3;
						break;
					}
				}
				if (flag != 3) {
					if (num > 12) {
						uni.showToast({
							icon: 'none',
							title: '长度最多为6个汉字或12个字母数字！'
						})
						return false;
					} else if (num < 1) {
						uni.showToast({
							icon: 'none',
							title: '食物名称不能为空！'
						})
						return false;
					}
					return true;
				} else {
					uni.showToast({
						icon: 'none',
						title: '不能包含特殊符号!'
					})
					return false;
				}
			},

			ipt() {},
		}
	};
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.ipt {
		width: 690upx;
		height: 77upx;
		display: block;
		margin: 50upx auto 0;
		font-size: 28upx;
		border-bottom: 1upx solid #eeeeee;
	}

	.btn {
		margin: 75upx auto;
		width: 690upx;
		height: 100upx;
		line-height: 100upx;
		background: #66d0ce;
		border-radius: 50upx;
		font-size: 32upx;
		color: #ffffff;
		text-align: center;
	}

	.tips {
		width: 690upx;
		margin: 23upx auto 0;
		height: 24upx;
		font-size: 24upx;
		font-weight: 400;
		color: #666666;
		line-height: 24upx;
	}
</style>
