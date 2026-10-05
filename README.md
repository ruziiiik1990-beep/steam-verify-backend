<html lang="ru" data-theme="\(COLOR_SCHEME\)">
<head>
<meta name="color-scheme" content="\(COLOR_SCHEME\)">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Страница входа - \(SITE_NAME\)</title>
<link rel="preconnect" href="https://googleapis.com">
<link rel="preconnect" href="https://gstatic.com" crossorigin>
<link rel="stylesheet"
 href="https://googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
<link href="https://googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<?if(\(PAGE_ID\) = 'sitePage1' || \(PAGE_ID\) = 'sitePage2' || (\(MODULE_ID\) = 'shop' && (\(PAGE_ID\) = 'category' || \(PAGE_ID\) = 'home' || \(PAGE_ID\) = 'wishlist' || \(PAGE_ID\) = 'usergoods' || \(PAGE_ID\) = 'entry')))?>
<link type="text/css" rel="stylesheet" href="/.s/t/2301/swiper/swiper-bundle.min.css">
<?endif?>
<link rel="stylesheet" href="/.s/src/css/2301.css" />

<style>
 /* Полностью очищаем базовые фоны у тегов */
 html, body {
 background-color: transparent !important;
 margin: 0 !important;
 padding: 0 !important;
 height: auto !important;
 }

 /* Главный каркас делаем прозрачным без ограничений */
 #layout, .layout {
 background: transparent !important;
 height: auto !important;
 }

 /* Настраиваем фон под шапкой, чтобы ползунок прокрутки шел до самого низа картинки */
 .main {
 background-image: url('https://moy.su') !important;
 background-size: 100% auto !important; 
 background-repeat: no-repeat !important;
 background-position: center -100px !important; 
 background-attachment: scroll !important;
 background-color: transparent !important;
 height: auto !important;
 min-height: calc((100vw / 1.364) - 100px) !important;
 box-sizing: border-box !important;
 padding-bottom: 0 !important;
 margin-bottom: 0 !important;
 }

 /* Стили для блока Steam на странице входа */
 .steam-auth-container {
 text-align: center;
 margin-bottom: 25px;
 padding: 15px;
 background: rgba(255, 255, 255, 0.05);
 border-radius: 8px;
 border: 1px solid rgba(255, 255, 255, 0.1);
 }
 .steam-login-btn {
 display: inline-block;
 background: #171a21;
 padding: 2px 2px;
 border-radius: 5px;
 text-decoration: none;
 border: 1px solid #101217;
 transition: background 0.2s, transform 0.1s;
 }
 .steam-login-btn:hover {
 background: #242933;
 transform: scale(1.02);
 }
 .steam-user-box {
 background: rgba(0, 0, 0, 0.85);
 color: #fff;
 padding: 20px;
 border-radius: 8px;
 font-family: sans-serif;
 border: 1px solid #171a21;
 display: inline-block;
 text-align: left;
 min-width: 250px;
 }
</style>
</head>
<body class="module-\(MODULE_ID\)">
<div id="layout" class="layout \(PAGE_ID\)-layout">
 \(GLOBAL_AHEADER\)
 <?if(\(PAGE_ID\)='sitePage1')?>\(GLOBAL_SLIDER\)<?endif?>
 <div class="main">
 <div class="container main-container">
 <?if(\(MODULE_ID\)='forum')?><div class="tpl-content forum-box"><?endif?>
 <!-- <middle> -->
 <div class="tpl-content">
 <?if(\(PAGE_ID\)='sitePage1')?>
 <div class="info-box goods-box">
 <h2>Popular goods</h2>
 <div class="goods-list">
 <!--<new_informer>-->{
 "title":"Popular goods",
 "module":"sh",
 "sort":"6",
 "max_entries":"6",
 "max_columns":"1",
 "categories_list":"",
 "entries_list":"",
 "title_max_length":"",
 "data_type":"0",
 "curdate":"",
 "template":"<div class=\"product-card\"><div class=\"product-pictures\"><a class=\"product-img-link\" href=\"\(ENTRY_URL\)\"><img id=\"\(BLOCK_PREF\)-gphoto-ID\" class=\"product-img\" src=\"THUMB\" alt=\"NAME\"></a></div><div class=\"product-content\"><div class=\"product-actions\">2WISHLIST 2COMPARE</div><div class=\"product-main\"><a class=\"product-card-title\" href=\"\(ENTRY_URL\)\">NAME</a></div><div class=\"product-buy-box\"><div class=\"price-box\"><?if(\(PRICE_OLD\))?><s>\(PRICE_OLD\)</s> <span class=\"newprice\">PRICE</span><?else?>PRICE<?endif?></div><div class=\"basket-container\"><?if(OPTIONS)?><a class=\"basket-link\" href=\"\(ENTRY_URL\)\"></a><?else?>2BASKET<?endif?></div></div></div></div>",
 "no_entries_msg":"No added products"
 }<!--</new_informer>-->
 </div>
 <a class="catalog-link" href="/shop"><!--<s240347>-->Перейти в каталог<!--</s>--></a>
 </div>
 <?endif?>
 <?if(\(PAGE_ID\)='sitePage3')?>
 \(GLOBAL_CONTACTBOX\)
 <?endif?>
 <?if(\(MODULE_ID\)='index')?><div class="index-page-content"><?endif?><!-- <body> -->
 
 <div class="login-form-wrapper">
 
 <!-- Динамический контейнер авторизации Steam -->
 <div class="steam-auth-container">
 <div id="steam-auth-block">
 <!-- Сюда встанет либо кнопка, либо профиль -->
 </div>
 </div>

 <!-- Стандартная форма входа uCoz -->
 BODY
 
 </div>
 
 <!-- </body> --><?if(\(MODULE_ID\)='index')?></div><?endif?>
 <?if(\(PAGE_ID\)='sitePage1' || \(PAGE_ID\)='sitePage2')?>
 \(GLOBAL_TEAM\)
 <?endif?>

 <?if(\(PAGE_ID\)='sitePage1' || \(PAGE_ID\)='sitePage2')?>
 \(GLOBAL_REVIEWS\)
 <?endif?>

 <?if(\(PAGE_ID\)='sitePage1')?>
 \(GLOBAL_ADVANTAGES\)
 <?endif?>

 <?if(\(PAGE_ID\)='sitePage1')?>
 \(GLOBAL_LANDBOX\)
 <?endif?>

 <?if(\(PAGE_ID\)='sitePage1')?>
 \(GLOBAL_FAQ\)
 <?endif?>
 </div>
 <?if(!\(HIDE_CLEFTER\))?>
 <aside id="sidebar" class="sidebar">
 <div class="sidebar-container">
 \(GLOBAL_CLEFTER\)
 </div>
 </aside>
 <?endif?>
 <!-- </middle> -->
 <?if(\(MODULE_ID\)='forum')?></div><?endif?>
 </div>
</div>

<!-- Скрипт проверки сессии Steam и Firebase Realtime Database -->
<script>
	const urlParams = new URLSearchParams(window.location.search);
	let steamId = urlParams.get('steamid');

	if (!steamId) {
		steamId = localStorage.getItem('logged_steam_id');
	} else {
		localStorage.setItem('logged_steam_id', steamId);
	}

	const authBlock = document.getElementById('steam-auth-block');

	if (steamId) {
		// Читаем запись напрямую из твоей Firebase Realtime Database
		fetch(`https://firebaseio.com{steamId}.json`)
		.then(res => res.json())
		.then(data => {
			if (data) {
				authBlock.innerHTML = `
					<div class="steam-user-box">
						<p style="margin:0 0 8px 0; font-size:12px; color:#4caf50; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">Авторизован через Steam</p>
						<div style="font-weight:bold; font-size:15px; color:#fff; word-break:break-all; font-family:monospace;">ID: ${data.steamId}</div>
						<p style="margin:8px 0 0 0; font-size:11px; color:#888;">Статус в базе: ${data.status}</p>
						<button onclick="logoutSteam()" style="margin-top:14px; background:#d9534f; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer; width:100%; transition:background 0.2s;">Выйти из аккаунта</button>
					</div>
				`;
			} else {
				showLoginButton();
			}
		})
		.catch(() => showLoginButton());
	} else {
		showLoginButton();
	}

	function showLoginButton() {
		const returnUrl = 'https://github.io';
		
		// Ссылка генерации запроса OpenID к Valve
		const steamOpenIdUrl = 'https://steamcommunity.com' +
			'?openid.ns=' + encodeURIComponent('http://openid.net') +
			'&openid.mode=checkid_setup' +
			'&openid.return_to=' + encodeURIComponent(returnUrl) +
			'&openid.realm=' + encodeURIComponent(window.location.origin) +
			'&openid.identity=' + encodeURIComponent('http://openid.net/identifier_select') +
			'&openid.claimed_id=' + encodeURIComponent('http://openid.net/identifier_select');

		authBlock.innerHTML = `
			<p style="color:#fff; font-family:sans-serif; font-size:14px; margin:0 0 12px 0; font-weight:500;">Быстрый вход для игроков:</p>
			<a href="${steamOpenIdUrl}" class="steam-login-btn">
				<img src="https://steamstatic.com" alt="Войти через Steam" style="vertical-align:middle; display:block;">
			</a>
		`;
	}

	function logoutSteam() {
		localStorage.removeItem('logged_steam_id');
		window.location.href = window.location.origin + window.location.pathname;
	}
</script>

\(GLOBAL_BFOOTER\)
</div>

<script src="/.s/t/2301/main.js"></script>
<?if(BASKET)?>
<script src="/.s/t/2301/shop-cart.min.js?v=1.0"></script>
<?endif?>
</body>
</html>
