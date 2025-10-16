<template>
	<view>
		<view class="item m-[15px] p-[15px]">
			<div class="!flex items-center justify-between">
				<div class="text-[20px] !flex items-center font-bold">
					<uni-icons class="cc" type="pyq" size="30" color="transparent"></uni-icons>
					<span class="!ml-[5px] cc">数据统计</span>
				</div>
			</div>
			<div class="!grid !grid-cols-2 !gap-[10px] !mt-[10px]">
				<view v-for="(item, index) in card" :key="index"
					class="item !p-[10px] !py-[15px] !rounded-[10px] text-center !flex flex-col justify-center items-center">
					<div class="!text-[18px]">{{ item.label }}</div>
					<div class="!text-[18px] mt-[5px]">{{ item.total_value }}</div>
					<div class="!text-[20px] mt-[5px] text-red-500">今日 +{{ item.yesterday_value }}</div>
				</view>
			</div>
		</view>
	</view>
</template>

<script>
import _ from 'lodash'
export default {
	data() {
		return {
			card: {
				totalCheckinCollectCommentCount: {
					label: '点评收藏打卡总点击数',
					yesterday_value: 0,
					total_value: 0
				},
				dianpingGroupBuyClickCount: {
					label: '大众点评团购点击数',
					yesterday_value: 0,
					total_value: 0
				},
				totalEnterCount: {
					label: '总碰一下次数',
					yesterday_value: 0,
					total_value: 0
				},
				dianpingClickCount: {
					label: '大众点评点击数',
					yesterday_value: 0,
					total_value: 0
				},
				gaodeClickCount: {
					label: '高德点击数',
					yesterday_value: 0,
					total_value: 0
				},
				douyinClickCount: {
					label: '抖音点击数',
					yesterday_value: 0,
					total_value: 0
				},
				meituanClickCount: {
					label: '美团点击数',
					yesterday_value: 0,
					total_value: 0
				},
				ctripClickCount: {
					label: '携程点击数',
					yesterday_value: 0,
					total_value: 0
				},
				xiaohongshuClickCount: {
					label: '小红书点击数',
					yesterday_value: 0,
					total_value: 0
				},
				momentsClickCount: {
					label: '朋友圈点击数',
					yesterday_value: 0,
					total_value: 0
				},
				addWechatClickCount: {
					label: '加微信点击数',
					yesterday_value: 0,
					total_value: 0
				},
				douyinGroupBuyClickCount: {
					label: '抖音团购点击数',
					yesterday_value: 0,
					total_value: 0
				},
				meituanGroupBuyClickCount: {
					label: '美团团购点击数',
					yesterday_value: 0,
					total_value: 0
				},
				wifiButtonClickCount: {
					label: 'wifi按钮点击数',
					yesterday_value: 0,
					total_value: 0
				}
			}
		}
	},
	onShow() {
		this.getCard()
	},
	methods: {
		getCard() {
			this.$http.get('/pengyipeng/user-app/api/getClickData', { isAll: 0 }).then(res => {
				_.forEach(this.card, (item, key) => {
					item.yesterday_value = res.result[key]
				})
			})
			this.$http.get('/pengyipeng/user-app/api/getClickData', { isAll: 1 }).then(res => {
				_.forEach(this.card, (item, key) => {
					item.total_value = res.result[key]
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
	font-size: 20px;
}

.item {
	border-radius: 12px;
	border: 1px solid #E5E0D3;
	// box-shadow: 1px 3px 8px 0px rgba(216, 204, 167, 0.6);
}
</style>
