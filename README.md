# industrial-ui

## [inl-util](/packages/util/README.md)

## [inl-ui](/packages/pc/README.md)


## 主题使用
1. 安装 inl-ui 最新版本，
> vite.config.ts
``` ts
import { defineConfig } from 'vite';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const additionalData = require('inl-ui/dist/theme').default;



export default defineConfig(() => ({
  ...,
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData,
      },
    },
  },
}));

```