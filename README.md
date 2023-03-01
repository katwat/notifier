# notifier.js

notifier.js は通知機能な Javascript ライブラリです。

- 一定時間だけテキストを表示する ***toast***
- 「Loading...50%」といったモーダルな進捗表示する ***progress***
- 「Cancel」「OK」といったモーダルな確認表示する ***confirm***

の3種類から成ります。

# Demo

[こちら](http://katwat.s1005.xrea.com/notifier-demo/)で動作の例を試すことが出来ます。

# 使い方

```<link rel="stylesheet" href="notifier.min.css">```

```<script src="notifier.min.js"></script>```

上記のように CSS とJS ファイルを組み込んで、例えば以下のように書くだけです。

```Notifier.toast('Hello, World!');```

# API

## toast() - 一定時間テキストを表示

```Notifier.toast(text[,options])```

- `text` 表示テキスト {string}
- `options` オプション {object}

```
{ // プロパティと既定値。
	pos: 'c', // 表示位置。
		// 'c','t','l','r','b','tl','tr','bl','br' のいずれか。
		// ぞれぞれ、中央、上、左、右、下、左上、右上、左下、右下を示す。
	custom: undefined, // 表示をカスタマイズするための追加クラス名。
	icon: undefined, // アイコン表示のための追加クラス名。
	onclose: undefined, // 表示が閉じた時のコールバック。
	timeout: 3000 // 表示する時間(単位はms)。ただし0以下の場合は自動で閉じないので、明示的にclose()する必要あり。
}
```

***例：***

```
// CSS
.notifier > .success {
	color: #fff;
	background-color: #218721;
}

// JS
Notifier.toast('Hello, World!',{
	pos: 't',
	custom: 'success',
	timeout: 5000
});
```

## progress() - モーダルな進捗表示

```Notifier.progress(text[,options])```

- `text` 表示テキスト {string}
- `options` オプション {object}

```
{ // プロパティと既定値。
	pos: 'c', // 表示位置。
		// 'c','t','l','r','b','tl','tr','bl','br' のいずれか。
		// ぞれぞれ、中央、上、左、右、下、左上、右上、左下、右下を示す。
	custom: undefined, // 表示をカスタマイズするための追加クラス名。
	icon: undefined, // アイコン表示のための追加クラス名。
	onclose: undefined, // 表示が閉じた時のコールバック。
}
```

***説明：***

progress では最初の実行で表示を開始し、以降の実行でテキストを更新できます。最後にテキスト無しで実行すると自動で表示を閉じます。

***例：***

```
// CSS
@keyframes anim-rotate {
	0% {
		transform: scale(1.5) rotate(0);
	}
	100% {
		transform: scale(1.5) rotate(360deg);
	}
}
.notifier > .progress > .spinner {
	animation: anim-rotate 1s infinite linear;
	color: #0c0;
	margin: 0 .75em 0 0;
}

// JS
// 最初の実行。
Notifier.progress('Loading...',{
	icon: 'icon-spinner spinner'
});

// 以降の実行。
Notifier.progress('Loading...1%');
Notifier.progress('Loading...2%');
	︙
Notifier.progress('Loading...100%');

// 最後にテキスト無しで実行すると自動で表示を閉じる。
Notifier.progress();
```

***メモ：***

アイコンフォントは [IcoMoon](https://icomoon.io/) などで入手可能です。

## confirm() - モーダルな確認表示

```Notifier.confirm(text[,options])```

- `text` 表示テキスト {string}
- `options` オプション {object}

```
{ // プロパティと既定値。
	pos: 'c', // 表示位置。
		// 'c','t','l','r','b','tl','tr','bl','br' のいずれか。
		// ぞれぞれ、中央、上、左、右、下、左上、右上、左下、右下を示す。
	custom: undefined, // 表示をカスタマイズするための追加クラス名。
	icon: undefined, // アイコン表示のための追加クラス名。
	onclose: undefined, // 表示が閉じた時のコールバック。
	ok: 'OK', // OKボタンのキャプション文字列。nullまたは空文字の時はボタン無し。
	onok: undefined, // OKボタンをクリックした時のコールバック。
	cancel: 'Cancel', // Cancelボタンのキャプション文字列。nullまたは空文字の時はボタン無し。
	oncancel: undefined // Cancelボタンをクリックした時のコールバック。
}
```

***例：***

```
// CSS
.notifier > div > i {
	margin: 0 .75em 0 0;
	transform: scale(1.5);
}

// JS
Notifier.confirm('Is that OK?',{
	icon: 'icon-info',
	onok: function() {console.log('OK clicked');},
	cancel: null
});

```

## close() - 表示を閉じる

```Notifier.close([force])```

- `force` trueなら強制的に閉じる {boolean}

***説明：***

force 無しで実行すると、短時間の fade-out 完了後に表示を閉じます。

## escapeText - テキストをエスケープ

```Notifier.escapeText = true; // default```

***説明：***

既定では、テキストに含まれる `<` や `>` といった HTML なメタ文字はエスケープされて特別な意味を持たない文字そのままとして表示されます。`Notifier.escapeText = false;` とやると、HTML なテキストを渡すことが可能になりますが、予期しない結果となる場合があるかもしれません。使用の際は自己責任でお願いします。

## timeoutDelay - トースト表示が閉じるまでの既定時間（単位はms）

```Notifier.timeoutDelay = 3000; // default```

## transitionDuration - fade-in/outに要する既定時間（単位はms）

```Notifier.transitionDuration = 333; // default (-> CSS: transition-duration)```

## transitionTiming - fade-in/out変化の既定方式

```Notifier.transitionTiming = 'linear'; // default (-> CSS: transition-timing-function)```

