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
			console.log("merchantId:", options.merchantId);
			this.$http.get('/pengyipeng/user-app/api/getMerchantWechatQrCode', {
				merchantId: options.merchantId,
			}).then(res => {
				this.url = res.result;
				console.log("QrCode.vue: res.result:", res.result);
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
