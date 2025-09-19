<template>
	<view class="px-[20px] pb-[15px] relative" style="border-radius: 20px 20px  0 0;">
		<div class="relative !mb-[5px]">
			<div class="aspect-[3/2] !-mx-[20px]">
				<image class="!size-full" mode="aspectFill" :src="merchant.merchantMainPic">
				</image>
			</div>

			<div @click="chooseMedia"
				class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#00000055] w-[100px] h-[100px] !rounded-[50%] !flex flex-col justify-center items-center text-white">
				<uni-icons type="camera-filled" size="50" color="#ffffff"></uni-icons>
			</div>
		</div>
		<view class="!flex justify-between items-center dir tag-dir" @click="toStoreSetting">
			<view>
				<view class="font-bold text-[20px]"><text>{{ merchant.merchantName }}</text></view>
				<view class="!mt-[5px]">
					<text class="tag" v-for="item in merchant.keywords">{{ item }}</text>
				</view>
			</view>
			<view>
				<text class="cc">编辑</text>
			</view>
		</view>
		<template v-for="(item1, index1) in platforms" :key="index1">
			<view class="!grid grid-cols-2 gap-[15px] !mt-[25px] dir list-1">
				<view class="px-[12px] py-[15px] item" v-for="item2 in item1" @click="toSelect(item2)"
					:key="item2.label">
					<div class="!flex items-center">
						<image :src="item2.icon" class="!w-[40px] !h-[40px] !mr-[15px]" mode="aspectFit"></image>
						<view>
							<view class=" text-[14px] font-bold"><text>{{ item2.label }}</text></view>
							<view class=" text-[11px] text-[#666666] !mt-[5px]"><text>{{ item2.desc }}</text></view>
						</view>
					</div>
					<div class="dir !mt-[10px] !-mx-[12px]"></div>
					<div class="!flex items-center justify-between !mt-[10px]">
						<div class="text-[18px]">
							当前：
							<span v-if="!enablePlatform[item2.name]" class="text-[#FF4444]">未开启</span>
							<span v-else class="text-[#19BE6B]">已开启</span>
						</div>
						<uni-icons type="gear"></uni-icons>
					</div>
				</view>
			</view>
		</template>
		<view class="!mt-[35px] relative" @click="toWifiSetting">
			<image class="!w-full" mode="widthFix" src="/static/Group 46.png"></image>
			<view class="text-[14px] absolute" style="top: 7.5vw;left: 22vw;">
				<view>
					<text class="text-[#666666]">Wi-Fi名称：</text><text>{{ merchant.wifiUser }}</text>
				</view>
				<view>
					<text class="text-[#666666]">密码：</text><text>{{ merchant.wifiPwd }}</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
import qs from 'qs'
import { useMerchantStore } from '@/stores/merchant';
import { computed } from 'vue';
import { onShow } from '@dcloudio/uni-app'

export default {
	data() {
		return {
			img: '',
			platforms: [],
		}
	},
	onLoad(options) {
		if (!uni.getStorageSync('token') || !uni.getStorageSync('merchantId')) {
			uni.reLaunch({
				url: '/pages/login/login?retry=true'
			})
		}
	},
	onShow() {
		this.$http.get('/pengyipeng/api/getPypUsedPlatform').then(res => {
			this.platforms = res.result
		})
	},
	setup(ctx) {
		const merchantStore = useMerchantStore();
		const merchant = computed(() => {
			return merchantStore.merchant
		})
		const enablePlatform = computed(() => {
			return merchantStore.enablePlatform
		})
		onShow(() => {
			merchantStore.refreshMerchant()
		})
		merchantStore.refreshOperationGuidance()

		return {
			merchantStore,
			merchant,
			enablePlatform,
		}
	},
	methods: {
		toSelect(item) {
			uni.navigateTo({
				url: '/pages/fun-setting/fun-setting?' + qs.stringify(item, { encode: false, })
			})
		},
		toWifiSetting() {
			uni.navigateTo({
				url: '/pages/fun-setting/fun-setting?' + qs.stringify({
					name: 'wifi',
					desc: '连接Wi-Fi',
				}, { encode: false, })
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
						this.$http.post('/pengyipeng/api/editMerchantInfo', {
							merchantMainPic: res2.message,
						})
					})
				}
			});
		},
		toStoreSetting() {
			uni.navigateTo({
				url: '/pages/store-setting/store-setting'
			})
		}
	}
}
</script>

<style scoped lang="scss">
.dir {
	border-bottom: 1px solid #E5E0D3;
	padding: 0 20px;
	margin: 0 -20px;
}

.tag-dir {

	padding-bottom: 12px;

}

.cc {
	background-clip: text;
	color: transparent;
	background-image: linear-gradient(to right, #F06572, #8E64F8, #5B6CF7);
	font-size: 18px;
}

.tag {
	background: #F9EBC6;
	color: #666666;
	font-size: 16px;
	margin-right: 10px;
	padding: 2px 4px;
}

.list-1 {
	padding-bottom: 25px;

	.item {
		border-radius: 12px;
		box-shadow: 1px 3px 8px 0px rgba(216, 204, 167, 0.6);
	}
}
</style>
