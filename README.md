## 動作確認

2.と3.は初回時限定なので1度実行した後は、DBの変更がなければ行う必要はない

1. `make up`でプロダクトを立ち上げる
2. `make db/init`でDBを作成する(初回時のみ)
3. `make flyway/migrate`でDBのマイグレーションを行う(初回時のみ)
4. `http://localhost:3000`にアクセスする

## 各機能の設定

### フロントエンド

- ページURL: http://localhost:3000

### フロントエンド

- エンドポイント: http://localhost:1323

### データベース

- ポート: 3306

## コマンド一覧

`Makefile`に基本的なコマンドが定義されている。

コンテナ全体を起動
```
make up
```

特定のコンテナのみ起動
```
make container=db up
```

コンテナを削除
```
make down
```

データベースに接続
```
make db/client
```

データベースを初期化
```
make db/init
```

データベースを削除
```
make db/drop
```
