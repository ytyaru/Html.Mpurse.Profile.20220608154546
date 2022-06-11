# mpurseのアドレスにプロフィール情報を紐づけたい

* [暗号通貨のアドレスに名前とアバター画像をつけたい][]

[暗号通貨のアドレスに名前とアバター画像をつけたい]:https://monaledge.com/article/392

　Mpurse APIのアドレスとMastodonのプロフィールを紐付ける。両者のAPIを使って本人確認すればなりすましも不可能。さらにwebmentionでその情報を受け取り、TSVに加工して扱いやすくする。

[mpurse.getAddress]:https://github.com/tadajam/mpurse#getaddress
[mpurse.sendAsset]:https://github.com/tadajam/mpurse#sendasset
[mpurse.signMessage]:https://github.com/tadajam/mpurse#signmessage

# データについて

　ひとりの人間は、複数のアドレスとプロフィールをもちうる。プロフィールは各SNSサービスの各アカウントで別々のものである可能性がある。

* ひとりの人間
    * 別のサービス
        * 別のアカウント

　ようするに複垢の扱いを考えておかねばならない。単純に考えるなら、ひとつのアドレスにつき、ひとつのプロフィールを結びつければよい。ただ、複数のサービスやアカウントを使う場合も多いはず。

## 複数アドレス

* 別の暗号通貨
* 別のアドレス　

　本来なら上記のようにたくさんの選択肢がある。だが今回は暗号通貨はモナコインに限定し、アドレスはmpurseで作られたものに限る。その理由は、mpurseの署名により本人確認することで、なりすましを防げるから。

　もしかするとMonaParty APIを使えばmpurseを使わずとも署名が可能かもしれない。でも私にはその知識や技術もない。なので今はmpurseを使うことで解決する。

## 複数SNSサービス

　プロフィール情報を得るために利用する。なりすましを防ぐためにはAPIによる承認が必要。だがツイッターはAPIを使う条件に電話番号の提示があるため、私には不可能。マストドンとmisskeyが使えそう。

### 複数インスタンス

　マストドンはその特性上、インスタンスに分散する。そのインスタンスでアカウントを持っており、プロフィールをセットしている必要がある。

### プロフィール情報

* SNSのプロフィール情報を使う

## Webmention

* トゥートやノートの内容からmpurseのアドレスを取得する
* トゥートやノートした人のプロフィール情報を取得する（ユーザ名、アバター画像。おそらくユーザ名から自己紹介文も入手できる？）

# 紐づけ

* 複数アドレス
    * 複数SNSサービス
        * 複数アカウント

# 本人確認

* mpurseの署名でアドレスの本人確認をする
* SNSのAPIで承認し、アカウントの本人確認をする

# とりあえずメモだけ

　これを実装する前にmisskeyでノートするボタンを実装したい。

# 表示イメージ

```
+--------+ name @username
|アバター| mpurseアドレス
|  画像  | ■■■
+--------+ domain名1 domain名2 ...
```

* `name`は表示名。もし存在すればuser名より優先して表示する
* `username`はユーザID。これは確実に存在するはず。ただしサービスやアカウントによって違う可能性がある。どれを使うか決めるロジックも必要。
* mpurseアドレス。長ったらしい英数字
* ■はプロフィール設定しているサービスのアイコン
    * ■の下にはドメイン名を表示する

　Webmentionを解析して作成する。

# TSVイメージ

```
mpurseアドレス,name,url,gravatarHash,serviceType:serviceDommain:userId,serviceType:serviceDommain:userId,serviceType:serviceDommain:userId,...
```

* name, urlはserviceDommainよりも優先したいもの
    * `name`は通常、最初に投稿されたserviceDomainのものを使う
    * `url`は通常、最初に投稿されたserviceDomainのものを使う
* serviceTypeはmastodonかmisskeyかを区別するIDである

　もし、`name`や`url`を直接指定したものに変えたいときは入力フォームで指定する。

* serviceDomainの順序を変えたいときはどうしよう？
* 削除したいときは？

# JSONイメージ

```javascript
[
    {
        "address": "aaaaaaaaaaa",
        "name": "",
        "url": "",
        "gravatarHash": "ggggggggg",
        "mastodon": {
            "mstdn.jp": ["userId"],
            "pawoo.net": ["userId"],
            "domain": ["userId"],
        }
        "misskey": {

        }
    }
]
```

　アドレスをキーにする場合。こちらのほうがよさげ。

```javascript
{
    "mpurseAddress": {
        "name": "",
        "url": "",
        "avatar": "",
        "gravatarHash": "ggggggggg",
        "mastodon": {
            "mstdn.jp": ["userId"],
            "pawoo.net": ["userId"],
            "domain": ["userId"],
        },
        "misskey": {
            "misskey.io": ["userId"],
            "misskey.dev": ["userId"],
            "domain": ["userId"],
        },
    }
}
```

# 投稿イメージ

## 最小

```
mpurseアドレス
```

　domainを追加するとき、必ずこの形式でやらねばならない。mpurseの承認とSNSの承認の両方を済ます。SNSを複数セットしたければ、これをSNSの数だけ行う必要がある。承認手続きは一度にひとつだけしかできないから仕方ない。

　SNSドメインが既存なら変わらない。まだ追加されていないなら末尾に追加される。

## 最大

```
mpurseアドレス
name
url
intro
domain1
domain2
domain3
...
```

　指定したアドレスの設定を変更する。行位置と項目が紐づくことにする。変更しない場合は空白にする。削除するときは`***delete***`とする。domainは追加はできず順序を変えるだけ。もし存在するのに、ここに書かれていなければ削除される。
　
# 入力フォーム

```
[署名][mpurseアドレス]
name        [name]
url         [url]
gravatar    [hash]
mastodon
  mstdn.jp  [username]
  pawoo.net [username]
  instance  [username]
  [ + ][ instance domain or URL ]
misskey
  misskey.io  [username]
  misskey.dev [username]
  instance    [username]
  [ + ][ instance domain or URL ]
```

# API

## mastodon

* `https://docs.joinmastodon.org/methods/accounts/`
    * `https://${domain}/api/v1/accounts/${id}`
* https://qiita.com/KEINOS/items/c501bd433aa84d0d0108

```javascript
```

## misskey

* `https://misskey.kurume-nct.com/api-doc#operation/auth/session/userkey`

```javascript
```

```javascript
```

　まずは各サービスからプロフィール情報をゲットできるようにするのが先か。


