<template>
	<view class="p-[20px]">
		<div class="px-[12px] py-[15px] item">
			<div class="!flex items-center justify-between">
				<div class="!flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">店铺名称</span>
				</div>
			</div>
			<div class="dir !my-[10px] !-mx-[10px]"></div>
			<div class="bg-[#F5F5F5] p-[10px] !rounded-[5px]">
				<input class="text-[18px]" type="text" placeholder="请输入店铺名称" v-model="storeName">
			</div>
		</div>

		<div class="px-[12px] py-[15px] mt-[20px] overflow-hidden item">
			<div class="!flex items-center justify-between">
				<div class="!flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="20" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">店铺套餐</span>
				</div>
				<div>
					<span @click="addStorePackage"
						class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">添加</span>
				</div>
			</div>
			<div class="dir !my-[10px] !-mx-[10px]"></div>
			<div class="!flex flex-col gap-[10px] relative">
				<template v-for="(item, index) in lookAllPackage ? storePackages : storePackages.slice(0, 3)"
					:key="index">
					<div class="bg-[#F5F5F5] p-[10px] !rounded-[5px]" @click="editStorePackage(item)">
						<div class="!flex items-center justify-between">
							<div class="text-[18px]">{{ item.packageName }}</div>
							<div>
								<uni-icons type="right"></uni-icons>
							</div>
						</div>
					</div>
				</template>
				<template v-if="storePackages.length > 3">
					<div class="text-center" v-if="!lookAllPackage" @click="lookAllPackage = !lookAllPackage">
						展开全部
					</div>
					<div class="text-center" v-else @click="lookAllPackage = !lookAllPackage">
						收起
					</div>
				</template>
			</div>
		</div>

		<div class="px-[12px] py-[15px] mt-[20px] item">
			<div class="!flex items-center justify-between">
				<div class="!flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">店铺关键词</span>
				</div>
			</div>
			<div class="dir !my-[10px] !-mx-[10px]"></div>
			<div class="!flex flex-col gap-[10px]">
				<template v-for="(item, index) in keywordClassification"
					:key="index">
					<div class="bg-[#F5F5F5] p-[10px] !rounded-[5px]" @click="toEditKeywordClassification(item)">
						<div class="!flex items-center justify-between">
							<div class="text-[18px]">{{ item.bigKeywordName }}</div>
							<div>
								<uni-icons type="right"></uni-icons>
							</div>
						</div>
					</div>
				</template>
				<!-- <div class="bg-[#F5F5F5] p-[10px] !flex items-center !rounded-[5px]">
					<input v-model="storeKeyword" class="text-[18px] flex-1" type="text" placeholder="填写关键词"></input>
					<div>
						<span @click="addStoreKeyword"
							class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">添加</span>
					</div>
				</div>
				<div class="!flex flex-wrap gap-[10px]">
					<template v-for="(item, index) in storeKeywords" :key="index">
						<div class="keyword !inline-block">
							{{ item }}
							<span @click="storeKeywords.splice(index, 1)">
								<uni-icons type="trash-filled"></uni-icons>
							</span>
						</div>
					</template>
				</div> -->
			</div>
		</div>

		<div class="!flex gap-[10px] !mt-[30px] sticky bottom-[25px] left-0 right-0 z-10">
			<!-- <div class="btn disabled">
				关闭
			</div> -->
			<div class="btn fill" @click.prevent.stop="save">
				保存
			</div>
		</div>
		<div class="text-center mt-5 mb-10 text-[#888]" @click="logout">退出登录</div>
	</view>
</template>

<script>
import qs from 'qs'
import { useMerchantStore } from '@/stores/merchant';
import { forEach } from 'lodash';
export default {
	data() {
		return {
			merchantId: '',
			storeName: '',
			storeKeyword: '',
			storeKeywords: [],
			storePackages: [
			],
			lookAllPackage: false,
			keywordClassification: [
				// {
				// 	"id": "14143714647814717",
				// 	"bigKeywordName": "门店环境"
				// },
				// {
				// 	"id": "14143714647814716",
				// 	"bigKeywordName": "人物"
				// },
				// {
				// 	"id": "14143714647814714",
				// 	"bigKeywordName": "现场氛围"
				// },
				// {
				// 	"id": "14143714647814713",
				// 	"bigKeywordName": "演出"
				// }
			]
		}
	},
	onLoad(options) {
		const merchantStore = useMerchantStore()
		const merchant = merchantStore.merchant
		this.merchantId = merchant.id
		this.storeName = merchant.merchantName
		this.storeKeywords = merchant.keywords || []

		this.getKeywordClassification()
	},
	onShow() {
		this.$http.get('/pengyipeng/api/getMerchantPackageInfo').then(res => {
			this.storePackages = res.result
		})
	},
	methods: {
		logout() {
			const merchantStore = useMerchantStore()
			merchantStore.logout()
		},
		getKeywordClassification() {
			this.$http.get('/pengyipeng/api/getPlatformClassificationOptions', {
				merchantId: this.merchantId,
			}).then(res => {
				let classifications = []
				let rsl = res.result;
				for (let i=0; i<rsl.length; i++) {
					let item = rsl[i];
					classifications.push({"id":item["id"], "bigKeywordName":item["classificationChineseName"]})
				}
				this.keywordClassification = classifications
			})
		},
		toEditKeywordClassification(item) {
			this.$http.get('/pengyipeng/api/openMerchantClassification', {
				classificationOptionId: item.id,
				merchantId:this.merchantId,
			}).then(res=>{
				uni.navigateTo({
					url: '/pages/keyword-classification/keyword-classification?type_id=' + res.result.id + '&type_name=' + item.bigKeywordName+"&type_classification_option_id="+res.result.classificationOptionId,
					success: () => {
						// setTimeout(() => {
						// 	uni.$emit('sendKeywordClassification', JSON.parse(JSON.stringify(item)))
						// }, 100)
					},
				})
			});
		},
		addStoreKeyword() {
			if (!this.storeKeyword) {
				uni.showToast({
					title: '请输入关键词',
					icon: 'error',
				})
				return
			}
			this.storeKeywords.push(this.storeKeyword)
			this.storeKeyword = ''
		},
		addStorePackage() {
			// this.storePackages.push({
			// 	name: '',
			// 	imgs: [],
			// })
			uni.navigateTo({
				url: '/pages/package-save/package-save',
			})
		},
		editStorePackage(item) {
			console.log(qs.stringify({ id: item.id }, { encode: false }))
			uni.navigateTo({
				url: '/pages/package-save/package-save',
				success: () => {
					setTimeout(() => {
						uni.$emit('sendPackageItem', JSON.parse(JSON.stringify(item)))
					}, 100)
				},
			})
		},
		save() {
			this.$http.post('/pengyipeng/api/editMerchantInfo', {
				merchantName: this.storeName,
				merchantKeywordList: this.storeKeywords,
			})
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

.all-g {
	text-align: center;
	background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #FFFFFF);
	position: absolute;
	left: -15px;
	right: -15px;
	bottom: -15px;
	line-height: 50px;
}

.tag {
	background: #F9EBC6;
	color: #666666;
	font-size: 12px;
	margin-right: 10px;
	padding: 2px 4px;
}

.keyword {
	border: 1px solid #FF7300;
	border-radius: 5px;
	padding: 2px 5px;
	background: #FFECDC;
	font-size: 18px;
	color: #FF7300;
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

.box-img {
	border: 1px dashed #C0C0C0;
}
</style>
