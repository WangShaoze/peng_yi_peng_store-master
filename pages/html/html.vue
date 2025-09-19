<template>
	<view>
		<mp-html :content="html" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			html: ''
		}
	},
	onLoad(options) {
		this.$http.get('/pengyipeng/api/getAppInfo',{
			// flagKey: options.key,
			flagKey: 'ab6fdd4e76ec4b28a58888f77a72f67e',
		},{
			'Content-Type': 'text/markdown'
		}).then(res => {
			this.html = res.result[options.key]
		})
	},
	methods: {

	}
}
</script>

<style></style>
