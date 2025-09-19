<template>
	<view class="p-[20px]">

		<div class="px-[12px] py-[15px] item">
			<div class="!flex items-center justify-between">
				<div class="!flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">分类标签</span>
				</div>
			</div>
			<div class="dir !my-[10px] !-mx-[10px]"></div>
			<div class="!flex flex-col gap-[10px]">
				<div class="bg-[#F5F5F5] p-[10px] !flex items-center !rounded-[5px]">
					<input v-model="keyword" class="text-[18px] flex-1" type="text" placeholder="填写标签"></input>
					<div>
						<span @click="addKeyword"
							class=" float-right btn !py-[2px] !text-[18px] !px-[8px] !leading-5 !rounded-[5px]">添加</span>
					</div>
				</div>
				<div class="!flex flex-wrap gap-[10px]">
					<template v-for="(item, index) in keywords" :key="index">
						<div class="keyword !inline-block">
							{{ item.keyword }}
							<span @click="keywords.splice(index, 1)">
								<uni-icons type="trash-filled"></uni-icons>
							</span>
						</div>
					</template>
				</div>
			</div>
		</div>

		<view class="px-[12px] py-[15px] my-[20px] item">
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
				<template v-for="(img, index2) in packagePicList" :key="index">
					<view class="aspect-square !flex items-center justify-center box-img relative">
						<image @click="previewImg(packagePicList, index2)" :src="img" mode="aspectFill"
							class="w-full h-full"></image>
						<view class="absolute top-0 right-0">
							<uni-icons type="clear" size="20" @click="packagePicList.splice(index2, 1)"></uni-icons>
						</view>
					</view>
				</template>
			</view>
		</view>

		<div class="!flex gap-[10px] !mt-[30px]">
			<div class="btn disabled" @click="deleteType">
				关闭分类
			</div>
			<div class="btn fill" @click="saveTagClassification">
				保存并开启分类
			</div>
		</div>
	</view>
</template>

<script>
import _ from 'lodash'
import { useMerchantStore } from '@/stores/merchant';
export default {
	data() {
		return {
			type_id: '',
			keyword: '',
			keywords: [],
			packagePicList: [],
			merchantId: '',
			bigKeywordName:'',
			classificationOptionId:"",
		}
	},
	onLoad(options) {
		this.type_id = options.type_id
		this.classificationOptionId = options.type_classification_option_id

		uni.setNavigationBarTitle({
			title: options.type_name + '分类设置',
		})
		
		this.bigKeywordName = options.type_name;

		const merchantStore = useMerchantStore();
		const merchant = merchantStore.merchant;
		this.merchantId = merchant.id;

		this.getMerchantTagsList();
		this.getMerchantClassificationPicList();
		
		
	},
	methods: {
		addKeyword() {
			if (!this.keyword) {
				uni.showToast({
					title: '请输入关键词',
					icon: 'error',
				})
				return
			}
			console.log("this.keyword:", this.keyword);
			console.log("this.keywords:", this.keywords);
			if (this.keywords === undefined){
				this.keywords = []
			}
			this.keywords.push({keyword: this.keyword});
			this.keyword = '';
		},
		previewImg(list, index) {
			uni.previewImage({
				urls: list,
				current: index
			})
		},
		addPackageImg() {
			const _self = this
			uni.chooseImage({
				count: 100, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res) => {
					// _self.packagePicList.push(res.tempFilePaths[0])
					_.forEach(res.tempFilePaths, (item) => {
						_self.$http.upload(item).then(res2 => {
							console.log(_self.packagePicList)
							_self.packagePicList ??= []
							_self.packagePicList.push(res2.message)
						})
					})
				}
			});
		},
		getMerchantTagsList() {
			this.$http.get('/pengyipeng/api/getLittleTag', {
				classificationMiddleId: this.type_id,
				merchantId:this.merchantId
			}).then(res => {
				let tmpKeyWords = res.result;
				for (let i=0; i < tmpKeyWords.length; i ++){
					this.keywords.push({keyword:tmpKeyWords[i].tagName});
				}
			})
		},
		getMerchantClassificationPicList(){
			this.$http.get("/pengyipeng/api/getMerchantClassificationPicList", {
				merchantId:this.merchantId,
				classificationOptionId:this.classificationOptionId,
			}).then(res=>{
				this.packagePicList = res.result.picList;
			})
		},
		saveLittleTag() {
			let tagList = [];
			let kList = this.keywords;
			for (let i=0; i<kList.length; i++){
				tagList.push(kList[i].keyword);
			}
			this.$http.post('/pengyipeng/api/saveLittleTag', {
				merchantId:this.merchantId,
				classificationMiddleId: this.type_id,
				keywordList: tagList,
			}).then(res => {
				uni.showToast({
					title: '保存成功',
					icon: 'success',
				})
			})
		},
		saveTagClassification() {
			this.$http.post('/pengyipeng/api/saveTagClassification', {
				merchantId:this.merchantId,
				classificationId: this.classificationOptionId,
				picList: this.packagePicList,
			}).then(res => {
				uni.showToast({
					title: '保存成功',
					icon: 'success',
				});
				this.saveLittleTag();
			})
		},
		deleteType() {
			uni.showModal({
				title: '提示',
				content: '确定关闭此分类信息吗？',
				success: (res) => {
					if (res.confirm) {
						this.$http.get('/pengyipeng/api/openMerchantClassification', {
							classificationOptionId: this.classificationOptionId,
							merchantId:this.merchantId,
						})
					}
				}
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
