<template>
	<view class="p-[20px]">
		<view class="px-[12px] py-[15px] mb-[20px] item">
			<view class="!flex items-center justify-between">
				<view class="text-[14px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">基础信息</span>
				</view>
			</view>
			<view class="dir !my-[10px] !-mx-[10px]"></view>
			<input v-model="formData.packageName" class="bg-[#F5F5F5] p-[10px] rounded-[5px] text-[18px]" type="text"
				placeholder="请输入套餐名称">
			<textarea v-model="formData.packageDetails"
				class="bg-[#F5F5F5] p-[10px] rounded-[5px] w-[unset] mt-[10px] text-[18px]"
				placeholder-style="font-size:18px;" placeholder="请输入套餐详情"></textarea>
		</view>

		<view class="px-[12px] py-[15px] mb-[20px] item">
			<view class="!flex items-center justify-between">
				<view class="text-[14px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">套餐标签</span>
				</view>
				<view>
					<span @click="addStoreKeyword"
						class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">添加</span>
				</view>
			</view>
			<view class="dir !my-[10px] !-mx-[10px]"></view>
			<view class="!flex flex-col gap-[10px]">
				<template v-for="(item, index) in formData.tags" :key="index">
					<view class="bg-[#F5F5F5] p-[10px] !flex items-center !rounded-[5px]">
						<input v-model="formData.tags[index]" class="text-[18px] flex-1" type="text"
							placeholder="填写关键词"></input>
						<view @click="formData.tags.splice(index, 1)">
							<uni-icons type="trash-filled"></uni-icons>
						</view>
					</view>
				</template>
			</view>
		</view>

		<view class="px-[12px] py-[15px] mb-[20px] item">
			<view class="!flex items-center justify-between">
				<view class="text-[14px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">图片管理</span>
				</view>
			</view>
			<view class="dir !my-[10px] !-mx-[10px]"></view>
			<view class="!grid grid-cols-3 gap-[5px] mt-[5px]">
				<view class="aspect-square !flex items-center justify-center box-img" @click="addPackageImg">
					<uni-icons type="plus"></uni-icons>
				</view>
				<template v-for="(img, index2) in formData.packagePicList" :key="index">
					<view class="aspect-square !flex items-center justify-center box-img relative">
						<image @click="previewImg(formData.packagePicList, index2)" :src="img" mode="aspectFill"
							class="w-full h-full"></image>
						<view class="absolute top-0 right-0">
							<uni-icons type="clear" size="20"
								@click="formData.packagePicList.splice(index2, 1)"></uni-icons>
						</view>
					</view>
				</template>
			</view>
		</view>

		<view class="px-[12px] py-[15px] mb-[20px] item">
			<view class="!flex items-center justify-between">
				<view class="text-[14px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="20" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">支持平台</span>
				</view>
				<view>
					<span @click="handleSelectAll"
						class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">全选</span>
				</view>
			</view>
			<!-- <view class="dir !my-[10px] !-mx-[10px]"></view> -->
			<div class="!mt-[10px] !-mx-[10px]">
				<uni-list>
					<template v-for="(item, index) in platforms">
						<uni-list-item :title="item.label" :note="item.desc" :customStyle="{
							'padding': '10px',
							'backgroundColor': '#FFFCF4'
						}" :thumb="item.icon" thumb-size="lg" :showSwitch="true"
							:switchChecked="formData.platformList.includes(item.name)"
							@switchChange="(e) => handlePlatformChange(e.value, item)">

						</uni-list-item>
					</template>
				</uni-list>
			</div>
		</view>

		<view class="!flex gap-[10px] !mt-[30px] sticky bottom-[25px] left-0 right-0  z-10">
			<view class="btn fill" @click="save">
				保存
			</view>
		</view>

	</view>
</template>

<script>
import _ from 'lodash'
export default {
	data() {
		return {
			formData: {
				packageName: '',
				packageDetails: '',
				packagePicList: [],
				platformList: [],
				tags: []
			},
			platforms: []
		}
	},
	onLoad(options) {
		this.$http.get('/pengyipeng/api/getPypUsedPlatform').then(res => {
			this.platforms = _.flatten((Object.values(res.result))).filter(item => {
				return ['dazhong_tuan', 'douyin_tuan', 'meituan_tuan', 'wechat'].indexOf(item.name) == -1
			})
		})
		uni.$once('sendPackageItem', this.sendPackageItem)
	},
	onUnload() {
		uni.$off('sendPackageItem', this.sendPackageItem)
	},
	methods: {
		previewImg(list, index) {
			uni.previewImage({
				urls: list,
				current: index
			})
		},
		sendPackageItem(item) {

			this.formData = item
		},
		addPackageImg() {
			const _self = this
			uni.chooseImage({
				count: 100, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res) => {
					// _self.formData.packagePicList.push(res.tempFilePaths[0])
					_.forEach(res.tempFilePaths, (item) => {
						_self.$http.upload(item).then(res2 => {
							console.log(_self.formData)
							_self.formData.packagePicList ??= []
							_self.formData.packagePicList.push(res2.message)
						})
					})
				}
			});
		},
		addStoreKeyword() {
			this.formData.tags.push('')
		},
		save() {
			if (!this.formData.packageName) {
				uni.showToast({
					title: '请输入套餐名称',
					icon: 'none',
				})
				return
			}
			this.$http.post('/pengyipeng/api/editMerchantPackageInfo', this.formData, {
				// 'Content-Type': 'application/x-www-form-urlencoded'
			})
		},
		handlePlatformChange(checked, item) {
			this.formData.platformList ??= []
			if (checked) {
				this.formData.platformList.push(item.name)
			} else {
				this.formData.platformList = _.filter(this.formData.platformList, (i) => i !== item.name)
			}
		},
		handleSelectAll() {
			if (this.formData.platformList.length === this.platforms.length) {
				this.formData.platformList = []
			} else {
				this.formData.platformList = _.map(this.platforms, (item) => item.name)
			}
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
	font-size: 20px;
}

.btn {
	border: 1px solid #FF7300;
	border-radius: 50px;
	background: #FFECDC;
	font-size: 14px;
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

.box-img {
	border: 1px dashed #C0C0C0;
}
</style>
