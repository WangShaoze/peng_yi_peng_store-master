<template>
	<view>
		<image :src="bg" class="w-full" mode="widthFix"></image>
		<view class="absolute inset-0 flex flex-col items-center ">
			<!-- <image src="@/static/logo.png" class="logo" /> -->
			<!-- <view class="font-bold text-[30px] cc">
				<text>欢迎您登录</text>
			</view> -->

			<view class="input-box !flex items-center !px-[15px] w-[300px]" style="margin-top: 840rpx;">
				<text class="font-bold mr-[15px]">账号</text>
				<input v-model="username" class="h-[50px] flex-1" type="text" placeholder="请输入账号">
			</view>
			<view class="input-box !flex items-center !px-[15px] w-[300px] mt-[10px]">
				<text class="font-bold mr-[15px]">密码</text>
				<input v-model="password" class="h-[50px] flex-1" type="text" :password="true" placeholder="请输入密码">
			</view>
			<view v-if="!ok_agree" class="submit disabled">请先阅读并同意协议</view>
			<view v-else class="submit" @click="login">登录</view>

			<view class="text-center text-[#888] mt-[30px]">
				<checkbox :checked="ok_agree" @click="ok_agree = !ok_agree"></checkbox>
				<text>我同意</text>
				<text class="underline" @click="toHtml('appUserAgreement')">《用户协议》</text>
				<text>和</text>
				<text class="underline" @click="toHtml('appUserPrivacyPolicy')">《隐私政策》</text>
			</view>

			<view class="text-center mt-[20px] submit" @click="goRegister">
				<text class="mr-[5px]">前往激活</text>
				<uni-icons type="arrow-right" color="#fff"></uni-icons>
			</view>

			<!-- <button @click="getSilentCode">获取静默code</button>
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号code</button> -->

		</view>
	</view>
</template>

<script>
import { useMerchantStore } from '@/stores/merchant';
export default {
	data() {
		return {
			// dianjia1
			// dianJia123456@
			username: '',
			password: '',
			ok_agree: false,
			bg: '',
		}
	},
	onLoad(options) {
		this.$http.get('/pengyipeng/api/getMerchantEntranceMainPng',).then(res=>{
			this.bg = res.result
		})
		if(options.retry) {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					this.$http.post('/pengyipeng/api/merchantSilentLogin', {
						code: res.code
					}, {
						'Content-Type': 'application/x-www-form-urlencoded'
					}).then(res3=>{
						let result = res3.result
						const token = result.token
						uni.setStorageSync('token', token)
						uni.setStorageSync('merchantId', result.id)
						const merchantStore = useMerchantStore();
						merchantStore.refreshMerchant()
						uni.showToast({
							title: '登录成功',
							icon: 'none'
						})
						uni.reLaunch({
							url: '/pages/index/index'
						})
					})
				}
			})
		}
	},
	methods: {
		goRegister() {
			uni.navigateTo({
				url: '/pages/login/register'
			})
		},
		toHtml(key) {
			uni.navigateTo({
				url: '/pages/html/html?key=' + key
			})
		},
		getSilentCode() {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					uni.setClipboardData({
						data: JSON.stringify(res)
					})
				}
			})
		},
		getPhoneNumber(e) {
			uni.setClipboardData({
				data: JSON.stringify(e.detail)
			})
		},
		login() {
			this.$http.post('/sys/merchant_login', {
				username: this.username,
				password: this.password
			},).then(res => {
				let result = res.result
				const token = result.token
				uni.setStorageSync('token', token)
				uni.setStorageSync('merchantId', result.userInfo.merchantId)
				const merchantStore = useMerchantStore();
				merchantStore.refreshMerchant()
				uni.showToast({
					title: '登录成功',
					icon: 'none'
				})
				uni.reLaunch({
					url: '/pages/index/index'
				})
			})
		}
	}
}
</script>

<style scoped lang="scss">
.cc {
	background-clip: text;
	color: transparent;
	background-image: linear-gradient(to right, #F06572, #8E64F8, #5B6CF7);
}


.input-box {
	background: #eee;
	border-radius: 5px;
}

.submit {
	// box-shadow: 1px 3px 8px 0px rgba(216, 204, 167, 0.6);
	// border: 1px solid #eee;
	background: #1886ff;
	color: #fff;
	width: 250px;
	line-height: 50px;
	text-align: center;
	border-radius: 5px;
	margin-top: 30px;

	&.disabled {
		background: #888;
	}
}
</style>
