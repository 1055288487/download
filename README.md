# 说明：

1. 安装

    `npm i`

2. typescript 编译

    `tsc -w -p ./tsconfig.json`

3. 运行

    dev: 

    `npm run dev`

    production: 

    `npm start`

4. run as docker

    **production:**

    `docker run --restart=unless-stopped -d --name ds -v /home/wfs_download:/app -v /home/storage/netdisk:/storage -w /app -p 9126:9126 --link cloud.mongo:cloud.mongo node:alpine npm start`

    **dev mode:**

    `docker run --restart=unless-stopped -d --name ds -v /home/wfs_download:/app -v /home/storage/netdisk:/storage -w /app -p 9126:9126 --link cloud.mongo:cloud.mongo node:alpine npm run dev`



    http://netdisk.cloud.wswin.cn:9126/f/6/8/6/3/f6863078de6da6a841f44a62e6673223.dat