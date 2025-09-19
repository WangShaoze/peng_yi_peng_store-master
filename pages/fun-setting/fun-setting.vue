<template>
	<view class="p-[20px]">
		<div v-if="showStoreLink" class="px-[12px] py-[15px] !mb-[20px] item ">
			<div class="!rounded-[5px]">
				<div class="!flex items-center justify-between">
					<div class="text-[20px] !flex items-center font-bold">
						<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
						<span class="!ml-[5px] cc">粘贴店铺链接</span>
					</div>
					<div v-if="operationGuidance[query.name]" @click="previewImage(operationGuidance[query.name].split(','))">
						<span
							class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">查看教程</span>
					</div>
				</div>
				<div class="dir !my-[10px] !-mx-[10px]"></div>
				<textarea v-model="shortLink" @blur="extractUrls" placeholder="粘贴平台主页链接"
					class="!w-[unset] text-[14px] bg-[#F5F5F5] p-[10px]" placeholder-style="font-size: 18px;"
					:maxlength="-1"></textarea>

				<div v-if="parseShortLink" class="text-gray-400 text-[12px] break-words mt-[10px]">
					<span>{{ parseShortLink }}</span>
				</div>

			</div>
		</div>

		<div v-if="query.name == 'xiaohongshu'" class="px-[12px] py-[15px] !mb-[20px] item">
			<div class="!rounded-[5px]">
				<div class="!flex items-center justify-between">
					<div class="text-[20px] !flex items-center font-bold">
						<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
						<span class="!ml-[5px] cc">小红书话题</span>
					</div>
				</div>
				<div class="dir !my-[10px] !-mx-[10px]"></div>
				<textarea v-model="xhsTopics" placeholder="例如：#花店 #鲜花"
					class="!w-[unset] text-[18px] bg-[#F5F5F5] p-[10px]" placeholder-style="font-size: 14px;"
					:maxlength="-1"></textarea>
			</div>
		</div>

		<div v-if="query.name == 'wechat'" class="px-[12px] py-[15px] !mb-[20px] item">
			<div class="!rounded-[5px]">
				<div class="!flex items-center justify-between">
					<div class="text-[20px] !flex items-center font-bold">
						<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
						<span class="!ml-[5px] cc">添加微信二维码</span>
					</div>
				</div>
				<div class="dir !my-[10px] !-mx-[10px]"></div>
				<div class="relative !mb-[5px]">
					<image class="!w-full" mode="widthFix" :src="img || merchant.wechatQrCode"></image>
					<div @click="chooseMedia"
						class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#00000055] w-[100px] h-[100px] !rounded-[50%] !flex justify-center items-center">
						<uni-icons type="camera-filled" size="50" color="#ffffff"></uni-icons>
					</div>
				</div>
			</div>
		</div>

		<div v-if="query.name == 'wifi'" class="px-[12px] py-[15px] !mb-[20px] item">
			<div class="!flex items-center justify-between">
				<div class="text-[20px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">Wi-Fi</span>
				</div>
			</div>
			<div class="dir !my-[10px] !-mx-[10px]"></div>
			<div class="bg-[#F5F5F5] p-[10px] !rounded-[5px]">
				<input v-model="wifiUser" class="text-[18px]" type="text" placeholder="请输入Wi-Fi名称">
			</div>
			<div class="bg-[#F5F5F5] p-[10px] !mt-[10px] !rounded-[5px]">
				<input v-model="wifiPwd" class="text-[18px]" type="text" placeholder="请输入Wi-Fi密码">
			</div>
		</div>

		<div class="!flex gap-[10px] !mt-[30px]">
			<div class="btn disabled" @click="close" v-if="query.name != 'wifi'">
				关闭
			</div>
			<div class="btn fill" @click="save">
				保存并开启
			</div>
		</div>
	</view>
</template>

<script>
import { useMerchantStore } from '@/stores/merchant';
import { computed } from 'vue';

const merchantStore = useMerchantStore();

export default {
	data() {
		return {
			query: {},
			img: '',
			xhsTopics: '',
			shortLink: '',
			parseShortLink: '',
		}
	},
	onLoad(options) {
		this.query = options
		this.xhsTopics = merchantStore.merchant.xhsTopics

		if(this.showStoreLink) {
			let platformName = this.query.name;
			if (platformName === "dazhong_tuan"){
				platformName = "dazhong";
			}else if(platformName==="douyin_tuan"){
				platformName = "douyin";
			}else if(platformName==="meituan_tuan"){
				platformName = "meituan";
			}
			this.$http.get('/pengyipeng/user-app/api/getShortLinkInfo', {
				platformName: platformName,
			}).then(res => {
				this.shortLink = res.result.shortLink
				this.parseShortLink = res.result.parseInfo
			})
		}

	},
	setup() {
		const merchant = computed(() => {
			return merchantStore.merchant
		})
		const operationGuidance = computed(() => {
			return merchantStore.operationGuidance
		})
		return {
			merchantStore,
			merchant,
			operationGuidance,
			wifiUser: merchant.value.wifiUser,
			wifiPwd: merchant.value.wifiPwd,
		}
	},
	methods: {
		extractUrls() {
			const a = [
				'dianping', 'snssdk1128', 'amapuri', 'imeituan',
			];
			if (this.shortLink.indexOf('http') !== -1) {
				uni.showLoading({
					title: '正在解析链接',
				})
				this.$http.get('/pengyipeng/api/parseShortLink', {
					shortLinkStr: this.shortLink,
					platformName: this.query.name,
				}).then(res => {
					this.parseShortLink = res.result
					this.$http.post('/pengyipeng/api/saveShortLink', {
						platformName: this.query.name,
						shortLink: this.shortLink,
						parseResult: this.parseShortLink,
					}, {
						'Content-Type': 'application/x-www-form-urlencoded'
					})
				}).catch(e => {
					uni.showToast({
						title: '解析失败',
						icon: 'none'
					})
				}).finally(() => {
					uni.hideLoading()
				})
			} else {
				if (a.every(item => !this.shortLink.includes(item))) {
					uni.showToast({
						title: '请输入正确的链接',
						icon: 'none'
					});
					this.shortLink = '';
					return;
				}
			}
		},
		previewImage(urls) {
			uni.previewImage({
				urls: urls,
			})
		},
		chooseMedia() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res) => {
					this.$http.upload(res.tempFilePaths[0]).then(res2 => {
						this.img = res2.message
					})
				}
			});
		},
		close() {
			if (this.query.name != 'wifi') {
				this.$http.post('/pengyipeng/api/setEnablePlatform', {
					'platformName': this.query.name,
					'status': 0,
				}, {
					'Content-Type': 'application/x-www-form-urlencoded'
				})
			}
		},
		save() {
			if (this.query.name != 'wifi') {
				this.$http.post('/pengyipeng/api/setEnablePlatform', {
					'platformName': this.query.name,
					'status': 1,
				}, {
					'Content-Type': 'application/x-www-form-urlencoded'
				})
			}
			// if (this.showStoreLink) {
			// 	this.$http.post('/pengyipeng/api/saveShortLink', {
			// 		platformName: this.query.name,
			// 		shortLink: this.shortLink,
			// 		parseResult: this.parseShortLink,
			// 	})
			// }
			if (this.query.name == 'wifi') {
				this.modifyWifi()
				return
			}
			if (this.query.name == 'xiaohongshu') {
				this.modifyXhs()
				return
			}
			if (this.query.name == 'wechat') {
				this.uploadWechatPic()
				return
			}
		},
		modifyWifi() {
			if (!this.wifiUser) {
				uni.showToast({
					title: '请输入Wi-Fi名称',
					icon: 'none'
				})
				return
			}
			this.$http.post('/pengyipeng/api/saveWifiInfo', {
				wifiUser: this.wifiUser,
				wifiPwd: this.wifiPwd,
			}).then(() => {
				merchantStore.refreshMerchant()
			})
		},
		modifyXhs() {
			this.$http.post('/pengyipeng/api/saveXhsTopics', {
				'xhsTopics': this.xhsTopics,
			}, {
				'Content-Type': 'application/x-www-form-urlencoded'
			}).then(() => {
				merchantStore.refreshMerchant()
			})
		},
		uploadWechatPic() {
			this.$http.post('/pengyipeng/api/uploadWechatPic', {
				'merchantWechatPicUrl': this.img
			}, {
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		}
	},
	computed: {
		showStoreLink() {
			return ['xiaohongshu', 'wechat', 'wechat_friend', 'xiecheng', 'wifi'].indexOf(this.query.name) == -1
		}
	}
}
</script>

<style scoped lang="scss">
.dir {
	border-bottom: 1px solid #E5E0D3;
}

.item {
	border-radius: 12px;
	border: 1px solid #E5E0D3;
	// box-shadow: 1px 3px 8px 0px rgba(216, 204, 167, 0.6);
}

.cc {
	background-clip: text;
	color: transparent;
	background-image: linear-gradient(to right, #F06572, #8E64F8, #5B6CF7);
}

.btn {
	border: 1px solid #FF7300;
	border-radius: 50px;
	background: #FFECDC;
	font-size: 18px;
	color: #FF7300;
	flex: 1;
	text-align: center;
	line-height: 40px;

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
