<template>
	<view>
		<view class="absolute z-10 top-[50px] left-[20px] text-shadow-[0_0_1px_rgba(0,0,0,1)]" @click="goBack">
			<uni-icons type="arrow-left" color="#fff" size="30"></uni-icons>
		</view>
		<image :src="bg" class="w-full" mode="widthFix"></image>
		<view class="absolute inset-0 flex flex-col items-center ">
			<!-- <image src="@/static/logo.png" class="logo" /> -->
			<!-- <view class="font-bold text-[30px] cc">
				<text>欢迎您登录</text>
			</view> -->

			<view style="margin-top: 840rpx;" class="input-box !flex items-center !px-[15px] w-[300px]">
				<text class="font-bold mr-[15px]">证书</text>
				<input v-model="licenseKey" class="h-[50px] flex-1" type="text" placeholder="请输入账号">
				<uni-icons @click="scan" type="scan" size="20" color="#888888"></uni-icons>
			</view>
			<view v-if="!ok_agree" class="submit disabled">请先阅读并同意协议</view>
			<button v-else-if="licenseKey" class="submit" open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber">一键注册</button>
			<view v-else class="submit disabled">请先扫描或输入证书</view>

			<view class="text-center text-[#888] mt-[30px]">
				<checkbox :checked="ok_agree" @click="ok_agree = !ok_agree"></checkbox>
				<text>我同意</text>
				<text class="underline" @click="toHtml('appUserAgreement')">《用户协议》</text>
				<text>和</text>
				<text class="underline" @click="toHtml('appUserPrivacyPolicy')">《隐私政策》</text>
			</view>

			<!-- <button @click="getSilentCode">获取静默code</button> -->

		</view>
	</view>
</template>

<script>
import { useMerchantStore } from '@/stores/merchant';
import qs from 'qs';

export default {
	data() {
		return {
			licenseKey: '',
			ok_agree: false,
			bg: '',
		}
	},
	onLoad(options) {
		this.$http.get('/pengyipeng/api/getMerchantEntranceMainPng',).then(res => {
			this.bg = res.result
		})
	},
	methods: {
		toHtml(key) {
			uni.navigateTo({
				url: '/pages/html/html?key=' + key
			})
		},
		scan() {
			uni.scanCode({
				scanType: ['qrCode'],
				success: (success) => {
					if (success.result.includes('licenseKey')) {
						const params = qs.parse(success.result.split('?')[1]);
						this.licenseKey = params.licenseKey;
					} else {
						uni.showToast({
							title: '请扫描正确的二维码'
						})
					}
				},
			})
		},
		goBack() {
			uni.navigateBack({
				delta: 1
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
			this.$http.post('/pengyipeng/api/merchantLogin', {
				licenseKey: this.licenseKey,
				code: e.detail.code
			}, {
				'Content-Type': 'application/x-www-form-urlencoded'
			}).then(res => {
				const id = res.result.id
				const token = res.result.token
				uni.login({
					provider: 'weixin',
					success: (res2) => {
						this.$http.post('/pengyipeng/api/saveOpenid', {
							code: res2.code,
							merchantId: id,
						}, {
							'Content-Type': 'application/x-www-form-urlencoded'
						}).then(res3 => {
							let result = res3.result
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
			})
		},

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
