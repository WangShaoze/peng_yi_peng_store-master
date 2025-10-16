<template>
	<view class="min-h-[100vh] flex flex-col items-center justify-center">

		<image src="@/static/logo.png" class="w-[100px] h-[100px] rounded-[50px] mb-[30px]" />

		<view class="font-bold text-[30px] cc">
			<text>欢迎您使用</text>
		</view>

		<view class="!mt-[35px] !relative">
			<image class="w-[80vw]" mode="widthFix" src="/static/Group 46.png"></image>
			<view class="text-[14px] absolute" style="top: 7.5vw;left: 22vw;">
				<view>
					<text class="text-[#666666]">Wi-Fi名称：</text><text>{{ wifiUser }}</text>
				</view>
				<view>
					<text class="text-[#666666]">密码：</text><text>******</text>
				</view>
			</view>
		</view>

		<view class="btn fill" @click="connectWifi">立即连接</view>

	</view>
</template>

<script>
import semver from 'semver'
export default {
	data() {
		return {
			wifiUser: '',
			wifiPwd: '',
		}
	},
	onLoad(options) {
		console.log(options,'123')
		this.wifiUser = decodeURIComponent(options.wifiName)
		this.wifiPwd = decodeURIComponent(options.wifiPwd)
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				// 用户授权成功后，开始连接WiFi
				this.connectWifi();
			},
			fail: () => {
				wx.showToast({
					title: '授权失败',
					icon: 'none'
				});
			}
		});
	},
	methods: {
		connectWifi() {
			uni.showLoading({
				title: '连接中'
			})
			const systemInfo = uni.getSystemInfoSync()
			console.log(systemInfo)
			if (!semver.gte(systemInfo.version,'8.0.60')) {
				uni.showModal({
					title: '提示',
					content: '请将微信升级到8.0.60及以上版本',
					success: ({ confirm, cancel }) => {}
				})
				return
			}
			wx.startWifi({
				success: (success) => {
					uni.connectWifi({
						SSID: this.wifiUser,
						password: this.wifiPwd,
						// maunal: systemInfo.osName == 'android',
						suggestion: true,
						complete: (res) => {
							uni.hideLoading({})
						}
					})
				},
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

.btn {
	border: 1px solid #FF7300;
	border-radius: 50px;
	background: #FFECDC;
	font-size: 14px;
	color: #FF7300;
	// flex: 1;
	text-align: center;
	line-height: 40px;
	width: 150px;
	margin-top: 50px;

	&.fill {
		background: #FF7300;
		color: #FFF;
	}

	&.disabled {
		background: #F5F5F5;
		color: #C0C0C0;
		border: 1px solid #C0C0C0;
	}
}
</style>
