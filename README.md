## Overview

This plugin can create slit scanned images from movies and images using [node.js](https://nodejs.org/) .

### Install cairo and ffmpeg

Make sure [cairo](https://cairographics.org/) and [ffmpeg](https://ffmpeg.org/about.html)(Version 3.2 or later is required.) is installed on your system and properly set up in your `PATH`.

Ubuntu:

```shell
sudo apt-get update
sudo apt-get dist-upgrade
apt-get install ffmpeg libcairo2-dev
apt-get upgrade ffmpeg
```

Mac OS X (using [Homebrew](http://brew.sh/)):

```shell
brew update
brew install cairo --use-gcc
brew install ffmpeg
brew upgrade ffmpeg
```

Windows & others:

- ffmpeg : [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
- cairo : [https://cairographics.org/download/](https://cairographics.org/download/)

Confirm that ImageMagick is properly set up by executing `convert -help` in a terminal.


## Install

Install with [git](https://git-scm.com/) and [npm](https://docs.npmjs.com/getting-started/installing-node) and [node.js](https://nodejs.org/)

```
git clone https://github.com/tea3/slitscan.git
cd slitscan
npm install
```

## Usage

For example, please create `_config.yml` as follows.

```
projectDir: ../../sample Mov   #プロジェクトのディレクトリ
readDir:                       #読み込む動画ファイルや画像ファイルのディレクトリ
  - ../../sample Mov/target
distDir: ../../sample Mov/dist #出力先のディレクトリ

movToImg:
  movieStatTime: 1             #動画を静止画として切り出す開始位置
  movieLength: 30              #動画を静止画として切り出す長さ
  frameRate: 30                #動画を静止画として切り出すフレームレート (例 29.97)
  # frameRate: 60              #フレーム補間後に切り出したいフレームレート (例 60)
  # interpolate: 60            #フレーム補間したいフレームレート (例： 60) ※補間処理にはかなりの時間が必要です。目安: 10秒/1フレーム生成

scanLine: x                    #スキャン方向 (xまたはy)
inverseScan: false             #スキャン方向を逆転させる
reverseScan: false             #スキャン時間を逆転させる
startPosition: 0.0             #スキャンを開始する位置 (0.0 〜 1.0)

# autoDeleteTmp: true          #画像生成後、一時的なファイルを自動で削除するか否か
```

Then run node.js. Must install NodeJS from [https://nodejs.org/](https://nodejs.org/) beforehand to launch with "node index.js"

### Convert video to slitscan image

If you want to generate slit scan images from video files, write the following command. (e.g. convert `sample.mp4` to `slitscan.png`)

```
$ node index.js g
```

### Convert images to slitscan image

If you want to generate slit scan images from images files, write the following command. (e.g. convert `DSC0001.JPEG`〜`DSC4000.JPEG` to `slitscan.png`)

```
$ node index.js i
```

## Scan time listing

- X scan

| fomart | frame rate (fps) | scan time (sec) |
| :---: | :---: | :---: |
| 4K QFHD (3840x2160) | 30 | 128 |
| 4K QFHD (3840x2160) | 60 | 64 |
| 4K QFHD (3840x2160) | 120 | 32 |
| 2K Full HD (1920x1080) | 30 | 64 |
| 2K Full HD (1920x1080) | 60 | 32 |
| 2K Full HD (1920x1080) | 120 | 16 |
| HD (1280x720) | 30 | 43 |
| HD (1280x720) | 60 | 22 |
| HD (1280x720) | 120 | 11 |


- Y scan

| fomart | frame rate (fps) | scan time (sec) |
| :---: | :---: | :---: |
| 4K QFHD (3840x2160) | 30 | 72 |
| 4K QFHD (3840x2160) | 60 | 36 |
| 4K QFHD (3840x2160) | 120 | 18 |
| 2K Full HD (1920x1080) | 30 | 36 |
| 2K Full HD (1920x1080) | 60 | 18 |
| 2K Full HD (1920x1080) | 120 | 9 |
| HD (1280x720) | 30 | 24 |
| HD (1280x720) | 60 | 12 |
| HD (1280x720) | 120 | 6 |