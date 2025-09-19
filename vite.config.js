import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        uni(),
        UnifiedViteWeappTailwindcssPlugin(
            {
                rem2rpx: true,
                tailwindcssPatcherOptions: {
                    patch: {
                        tailwindcss: {
                            v4: {
                                base: __dirname
                            }
                        }
                    }
                }
            }
        ),
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss({
                    base: __dirname
                }),
                autoprefixer({
                    overrideBrowserslist: [
                        'last 2 versions', // 兼容每个浏览器的最后两个版本
                        '> 1%', // 兼容全球使用率超过1%的浏览器
                        'iOS >= 10', // 兼容iOS 10及以上
                        'Android >= 6' // 兼容Android 6及以上
                    ]
                })
            ]
        }
    }
});