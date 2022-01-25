# unit-settings

## SetUp

```sh
$ git clone git@github.com:nng01/unit-settings.git
$ cd unit-settings
$ yarn
```

## Dev

```sh
$ yarn dev
```

## Docker

```sh
$ docker-compose up -d
```

## PM2

### グローバルにインストール

```sh
$ npm install -g pm2
```

### 再起動

```sh
$ pm2 restart
```

### ログの確認

```sh
$ pm2 logs unit-settings
```

### モニタリング

```sh
$ pm2 monit
```

### クラスタリングモードでの起動

```sh
$ pm2 start pm2.config.yml
```

### 停止する

```sh
$ pm2 stop unit-settings
```
