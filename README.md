# Ticket System

学園祭の模擬店で使用するデジタルチケットアプリです。

## 技術スタック

- フロントエンド: Next.js, React, TypeScript, Tailwind CSS
- バックエンド: Next.js App Router
- データベース: Turso (SQLite)

## 機能

1.  **チケット作成**: 枚数を指定してランダムな ID を持つチケットを複数枚作成できます。
2.  **チケットページ**: 各チケット ID に対応するページで、チケットのステータス（使用可能/使用済み）を確認できます。
3.  **チケット使用**:
    - クライアントがチケットページのボタンを押す
    - 管理者ページから店側が直接コードを入力する
    - 管理者ページからカメラでチケット記載の QR コードを読み取り使用
4.  **管理者ダッシュボード**: チケットの発行枚数、使用済み枚数、使用率の統計情報を表示します。
5.  **管理者認証**: 管理者ページへのアクセスにはパスワード認証が必要です。認証期間は 1 年です。
6.  **待ち時間表示**: チケットページに現在の待ち組数を表示できます。

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/KusyFN/ticket-system
cd ticket-system
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Turso データベースの設定

1.  Turso アカウントを作成し、新しいデータベースをプロビジョニングします。
2.  データベースの URL と認証トークンを取得します。
3.  プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を記述します。

    ```
    TURSO_DATABASE_URL=YOUR_TURSO_DATABASE_URL
    TURSO_AUTH_TOKEN=YOUR_TURSO_AUTH_TOKEN
    ADMIN_PASSWORD=ADMIN_PASSWORD_CHANGE_ME

    NEXT_PUBLIC_SHOP_NAME=ワッフルショップ
    NEXT_PUBLIC_TICKET_ITEMS=プレーン,ココア,ティラミス,瀬戸内レモン,いちご,チョコソース,はちみつ,ブルーベリージャム,抹茶小豆
    ```

    `YOUR_TURSO_DATABASE_URL` と `YOUR_TURSO_AUTH_TOKEN`、`ADMIN_PASSWORD_CHANGE_ME`、`店の名前`、 `商品` を、実際の値に置き換えてください。

### 4. データベース設定

データベースの Turso の SQL console に以下を貼り付けて実行します。

```
CREATE TABLE counter (
  id INTEGER PRIMARY KEY,
  count INTEGER DEFAULT 0
);

CREATE TABLE tickets (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  item TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  usedAt TEXT
);
```

2 つのテーブルを作成後、データベースの URL と Token を`.env`ファイルに設定します。

## 開発環境の起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 使用方法

### 1. トップページ

- `http://localhost:3000` にアクセスします。
- 管理者ページへのリンクがあります。

### 2. 管理者ダッシュボード

- `http://localhost:3000/admin` にアクセスします。
- 初回アクセス時、または認証期間切れの場合はパスワード入力が求められます。
- パスワードは.env ファイルの中の`ADMIN_PASSWORD`です。
- 認証後、チケットの発行枚数、使用済み枚数、使用率の統計情報が表示されます。
- チケット作成ページとチケット使用ページへのリンクがあります。

### 3. チケット作成

- `http://localhost:3000/admin/create` にアクセスします。
- 「作成枚数」を入力し、「チケット作成」ボタンをクリックします。
- 作成されたチケット ID のリストが表示されます。各 ID は対応するチケットページへのリンクになっています。

### 4. チケットページへのアクセス

- 作成されたチケット ID のリンクをクリックするか、ブラウザで `http://localhost:3000/ticket?id={チケットID}` に直接アクセスします。
- チケットのステータス（使用可能/使用済み）が表示されます。
- 「使用可能」なチケットの場合、「チケットを使用する」ボタンが表示されます。

### 5. チケットの使用

#### クライアントからの使用

- チケットページで「チケットを使用する」ボタンをクリックします。
- チケットのステータスが「使用済み」に更新されます。

#### 管理者ページからの手動入力

- `http://localhost:3000/admin/use` にアクセスします。
- 「手動入力」タブを選択し、「チケット ID」を入力し、「チケットを使用する」ボタンをクリックします。
- 入力された ID のチケットが使用済みになります。

#### QR コード読み取り

- `http://localhost:3000/admin/use` にアクセスします。
- 「QR コードスキャン」タブを選択します。
- カメラへのアクセスを許可し、`http://localhost:3000/ticket?id={ticketID}` 形式の QR コードをカメラにかざします。
- QR コードが読み取られると、自動的にチケット ID が入力フォームにセットされます。

### 6. 待ち組数管理

#### 待ち組数を増やす

- `http://localhost:3000/add`のボタンで待ち組数が増やせます。

#### 待ち組数を減らす

- `http://localhost:3000/reduce`のボタンで待ち組数が減らせます。

#### 待ち組数を表示する

- `http://localhost:3000/preview`かチケットページから見ることができます。
