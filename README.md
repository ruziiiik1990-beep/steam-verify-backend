
<html lang="ru" data-theme="light">
<head>
<meta name="color-scheme" content="light">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Комментарии пользователя [ruzik_tasty] - ЧакЧак</title>
<link rel="preconnect" href="https://googleapis.com">
<link rel="preconnect" href="https://gstatic.com" crossorigin>
<link rel="stylesheet" href="https://googleapis.com">
<link href="https://googleapis.com" rel="stylesheet">

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

 /* Стили для кнопки Steam */
 .steam-login-btn {
 display: inline-block;
 background: #171a21;
 color: #fff;
 padding: 10px 20px;
 border-radius: 5px;
 text-decoration: none;
 font-family: sans-serif;
 font-weight: bold;
 font-size: 14px;
 border: 1px solid #101217;
 transition: background 0.2s;
 }
 .steam-login-btn:hover {
 background: #242933;
 }
 .steam-user-box {
 background: rgba(0, 0, 0, 0.7);
 color: #fff;
 padding: 15px;
 border-radius: 6px;
 font-family: sans-serif;
 }
</style>

	<link rel="stylesheet" href="/.s/src/base.min.css" />
	<link rel="stylesheet" href="/.s/src/layer7.min.css" />

	<script src="/.s/src/jquery-3.6.0.min.js"></script>
	<script src="/.s/src/uwnd.min.js"></script>

	<link rel="stylesheet" href="/.s/src/fancybox5/dist/css/fancybox5.min.css" />
	<link rel="stylesheet" href="/.s/src/moder_panel/moder_panel_new.min.css" />
	<link rel="stylesheet" href="/.s/src/socCom.min.css" />
	<link rel="stylesheet" href="/.s/src/social.css" />
	<script async type="module" src="/.s/src/fancybox5/dist/js/chunks/uFancy-runtime.min.js"></script>
	<script async type="module" src="/.s/src/fancybox5/dist/js/vendors/fancybox5.min.js"></script>
	<script type="module" src="/.s/src/fancybox5/dist/js/uFancy.min.js"></script>
	<script src="/.s/src/moder_panel/moder_scripts.min.js"></script>

	<style>.UhideBlockL{display:none; }</style>
</head>
<body class="module-index">
<div id="layout" class="layout \(PAGE_ID\)-layout">
	\(GLOBAL_AHEADER\)
	<?if(\(PAGE_ID\)='sitePage1')?>\(GLOBAL_SLIDER\)<?endif?>
	<div class="main">
		<div class="container main-container">
			
			<div class="tpl-content">
				<div class="index-page-content">
					<div class="breadcrumbs-wrapper">
						<div class="breadcrumbs">
							<a class="breadcrumb-item" href="https://moy.su">Главная</a>
							<span class="breadcrumb-sep">&raquo;</span>
							<span class="breadcrumb-curr">Комментарии пользователя [ruzik_tasty]</span>
						</div>
					</div>
					<div class="items-stat-wrapper">
						<div class="items-stat">Найдено комментариев: <b>0</b></div>
						<div class="paging-wrapper-top">Страницы: <b class="swchItemA"><span>1</span></b> </div>
					</div>
					<hr />
					<div style="padding:20px;" align="center">По запросу ничего не найдено</div>
					<hr />
				</div>
			</div>
			
			<aside id="sidebar" class="sidebar">
				<div class="sidebar-container">
					
					<!-- Блок авторизации через Steam -->
					<div id="steam-auth-block" style="margin-bottom: 20px;">
						<!-- Сюда JavaScript подставит либо кнопку, либо профиль игрока -->
					</div>

					\(GLOBAL_CLEFTER\)
				</div>
			</aside>
			
		</div>
	</div>
</div>

<!-- Логика работы с Firebase Realtime Database напрямую через браузер -->
<script>
	const urlParams = new URLSearchParams(window.location.search);
	let steamId = urlParams.get('steamid');

	// Если ID нет в ссылке, проверяем локальную память браузера (чтобы сессия не слетала при перезагрузке)
	if (!steamId) {
		steamId = localStorage.getItem('logged_steam_id');
	} else {
		localStorage.setItem('logged_steam_id', steamId);
	}

	const authBlock = document.getElementById('steam-auth-block');

	if (steamId) {
		// Запрашиваем данные игрока напрямую из твоей базы Firebase
		fetch(`https://firebaseio.com{steamId}.json`)
		.then(res => res.json())
		.then(data => {
			if (data) {
				authBlock.innerHTML = `
					<div class="steam-user-box">
						<p style="margin:0 0 5px 0; font-size:12px; color:#aaa;">Вы вошли через Steam</p>
						<div style="font-weight:bold; font-size:16px;">SteamID: ${data.steamId}</div>
						<button onclick="logoutSteam()" style="margin-top:10px; background:#d9534f; color:#fff; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">Выйти</button>
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

	// Функция генерации и показа кнопки входа
	function showLoginButton() {
		// Твоя ссылка на GitHub Pages для возврата
		const returnUrl = 'https://ruziiiik1990-beep.github.io/steamlogin/';
		
		// Ссылка для отправки запроса авторизации в систему Valve Steam OpenID
		const steamOpenIdUrl = 'https://steamcommunity.com' +
			'?openid.ns=http://openid.net' +
			'&openid.mode=checkid_setup' +
			`&openid.return_to=${encodeURIComponent(returnUrl)}` +
			`&openid.realm=${encodeURIComponent(window.location.origin)}` +
			'&openid.identity=http://openid.net/identifier_select' +
			'&openid.claimed_id=http://openid.net/identifier_select';

		authBlock.innerHTML = `
			<a href="${steamOpenIdUrl}" class="steam-login-btn">
				<img src="https://steamstatic.com" alt="Войти через Steam" style="vertical-align:middle;">
			</a>
		`;
	}

	// Функция выхода
	function logoutSteam() {
		localStorage.removeItem('logged_steam_id');
		// Очищаем параметры из ссылки и перезагружаем страницу
		window.location.href = window.location.origin + window.location.pathname;
	}
</script>

\(GLOBAL_BFOOTER\)
</div>

<script src="/.s/t/2301/main.js"></script>
</body>
</html>
