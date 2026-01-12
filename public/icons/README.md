# アイコン画像の配置場所

このディレクトリに以下のアイコン画像を配置してください。

## 必要なアイコン

1. **icon-192x192.png** (必須)
   - サイズ: 192 x 192 ピクセル
   - 用途: PWAアイコン (Android Chrome等)

2. **icon-512x512.png** (必須)
   - サイズ: 512 x 512 ピクセル
   - 用途: PWAアイコン (高解像度ディスプレイ)

3. **apple-touch-icon.png** (推奨)
   - サイズ: 180 x 180 ピクセル
   - 用途: iOS Safari (ホーム画面に追加時)

## アイコンデザインのヒント

- 背景色: #FFF8F0 (warm-cream) または #FFB7C5 (sakura)
- シンボル: 🎁 (プレゼント) を使ったデザインがおすすめ
- 角丸などの装飾は不要（各OSが自動的に適用します）
- PNG形式、透過背景でも単色背景でもOK

## 配置後

アイコンを配置した後、コミットして変更をプッシュしてください。

```bash
git add public/icons/*.png
git commit -m "Add PWA icons"
git push
```
