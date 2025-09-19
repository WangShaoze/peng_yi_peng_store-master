<template>
	<view>
		<image :src="url" class="w-full" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
			}
		},
		onLoad(options) {
			this.$http.get('/pengyipeng/user-app/api/getMerchantWechatQrCode',{
				merchantId: options.merchantId,
			}).then(res => {
				this.url = res.result
			}).finally(() => {
				uni.hideLoading({})
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
