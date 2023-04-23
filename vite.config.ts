import { defineConfig } from "vite";
import {resolve} from "path";
import { fileURLToPath, URL } from 'url'
import vue from "@vitejs/plugin-vue";
import viteCompression from 'vite-plugin-compression'
import WindiCSS from 'vite-plugin-windicss'
import vueJsx from "@vitejs/plugin-vue-jsx"
import styleImport from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import DefineOptions from 'unplugin-vue-define-options/vite'

// import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

const CWD = process.cwd()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    WindiCSS(),
    DefineOptions(), // https://vue-macros.sxzz.moe/macros/define-options.html
    // gzip压缩 生产环境生成 .gz 文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(CWD, 'src/assets/icons')],
      symbolId: 'svg-icon-[dir]-[name]'
    }),
    // Vite 按需引入 Ant Design Vue 
    // Components: ({
    //   resolvers: [AntDesignVueResolver()]
    // })
    // 2.0版本以下用
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js','ts','.json'], // 导入时想省略的扩展名
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `
          @import "@/assets/styles/global.less";
        `
      }
    }
  },
  optimizeDeps: {
    force: true // 强制进行依赖预构建
  },
  server: {
    port: 8080,
    open: true,
    https: false,
    // 设置代理
    proxy: {
      "/api": {
        target: "",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
