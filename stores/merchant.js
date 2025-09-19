import { defineStore } from 'pinia';
import { http } from "@/util/request"


export const useMerchantStore = defineStore('merchant', {
    state: () => {
        return {
            /** 商户信息 */
            merchant: {},
            /** 操作引导图片 */
            operationGuidance: {},
            /** 已开启平台 */
            enablePlatform: {},
        }
    },
    actions: {
        refreshMerchant() {
            http.get('/pengyipeng/api/merchantQueryById', {
                'merchantId': uni.getStorageSync('merchantId'),
            }).then(res => {
                this.merchant = res.result

                http.get('/pengyipeng/api/getEnablePlatform').then(res => {
                    this.enablePlatform = res.result
                })
            })
        },
        refreshOperationGuidance() {
            http.post('/pengyipeng/api/getOperationGuidancePng', {}).then(res => {
                this.operationGuidance = res.result
            })
        },
        logout() {
            this.merchant = {}
            this.operationGuidance = {}
            this.enablePlatform = {}
            uni.removeStorageSync('merchantId')
            uni.removeStorageSync('token')
            uni.reLaunch({
                url: '/pages/login/login'
            })
        }
    }
});