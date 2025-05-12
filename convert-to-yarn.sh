#!/bin/bash

# 刪除現有的 node_modules 和 package-lock.json
echo "刪除 node_modules 和 package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# 全局安裝 yarn (如果尚未安裝)
echo "確認 yarn 已安裝..."
if ! command -v yarn &> /dev/null; then
    echo "安裝 yarn..."
    npm install -g yarn
fi

# 使用 yarn 安裝依賴
echo "使用 yarn 安裝依賴..."
yarn install

echo "轉換完成！現在你的項目使用 yarn 作為包管理器。"
echo "請確保保留生成的 yarn.lock 文件並將其提交到版本控制中。"
