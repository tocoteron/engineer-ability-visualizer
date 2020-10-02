## 概要

本プロダクトは、新卒エンジニア採用担当向けのエンジニアの能力を可視化するWebサービスです。

採用担当の「会社にマッチしているエンジニアを採用したいがミスマッチがある」といった課題を解決するために作成しました。

現状の選考方法の例としては以下のようなものがあります。

- 書類選考
- 面接
- 筆記試験
- コーディイングテスト

これらは、本番一発勝負であったり選考のためだけに準備をしてくる場合が多いと思います。
その場合、エンジニアが本当はどんな人でどんな能力に長けているのかといった点は見えづらいのではないかと考えています。

その問題を解決するために本プロダクトでは、エンジニアのGitHubの普段の活動を分析し、能力として可視化します。

エンジニアの評価軸は、以下の通りです。

- 発見力 (課題を発見する能力)
  - イシュースコア
- 解決力 (課題に取り組む能力)
  - リポジトリスコア
  - コミットスコア
  - プルリクスコア
- スピード (課題に取り組む速さ)
  - コミットスピードスコア

![](./images/ability.png)

### 参考資料

https://drive.google.com/file/d/15qCIAcWko9MW1Wl4BE4UNkf-0Wpj84wz/view?usp=sharing


## 利用技術

![](./images/tech.png)

## アーキテクチャ

![](./images/architecture.png)

## 事前準備

### Firebase

Firebase: https://console.firebase.google.com/

1. Firebaseのプロジェクトを作成する
2. Firebaseのアプリを作成する
3. プロジェクトのSign-in methodとしてメール/パスワードを有効にする
4. アプリのコンフィグ(APIキー等)を取得する
5. プロジェクトのサービスアカウントの秘密鍵を取得する

#### 4. アプリのコンフィグ(APIキー等)を取得する

1. Firebaseのプロジェクトページを開く
2. `プロジェクトの概要`の右にある`⚙(歯車)`ボタンを押して、`プロジェクトの設定`へ遷移
3. マイアプリに作成したアプリを選んで`Firebase SDK snippet`の内容を取得
4. 本リポジトリの`frontend/src/firebase.ts`ファイルの`firebaseConfig`に取得した値を設定

#### 5. プロジェクトのサービスアカウントの秘密鍵を取得する

1. Firebaseのプロジェクトページを開く
2. `プロジェクトの概要`の右にある`⚙(歯車)`ボタンを押して、`プロジェクトの設定`へ遷移
3. タブの`サービスアカウント`へ遷移
4. `新しい秘密鍵の生成`ボタンを押して、秘密鍵をダウンロード
5. ダウンロードした鍵を本リポジトリの`backend/firebaseServiceAccountKey.json`へリネームして設置

## 動作確認

1.~6.は初回時限定なので1度実行した後は、DBの変更がなければ行う必要はない

各コマンドについてはコマンド一覧の項目を参照

1. `make env`
2. `make container=db up`でデータベースを起動
3. `make db/init`でDBを作成する(初回時のみ)
4. `make flyway/migrate`でDBのマイグレーションを行う(初回時のみ)
5. `make down`でコンテナを一度終了させる
6. `make GITHUB_TOKEN=$GITHUB_TOKEN BATCH_TICK_DURATION=$BATCH_TICK_DURATION up`でプロダクトを起動
7. ブラウザで`http://localhost:3000`にアクセスする

## 各機能の設定

### フロントエンド

- ページURL: http://localhost:3000

### フロントエンド

- エンドポイント: http://localhost:1323

### データベース

- ポート: 3306

## コマンド一覧

`Makefile`に基本的なコマンドが定義されている。

- $GITHUB_TOKEN: 自分で取得したGitHub APIのトークン
- $BATCH_TICK_DURATION: エンジニアの能力をDBに蓄積するバッチ処理が走る時間間隔(秒)

コンテナ全体を起動
```
make GITHUB_TOKEN=$GITHUB_TOKEN BATCH_TICK_DURATION=$BATCH_TICK_DURATION up
```

特定のコンテナのみ起動
```
make GITHUB_TOKEN=$GITHUB_TOKEN BATCH_TICK_DURATION=$BATCH_TICK_DURATION container=batch up
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

データベースをマイグレート
```
make flyway/migrate
```