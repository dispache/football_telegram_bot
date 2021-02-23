const { Telegraf } = require('telegraf');
const parser = require('./parser.js');

const TelegramBot = new Telegraf(process.env['football_telegram_bot']);

TelegramBot.start((ctx) => {
	ctx.reply(`Приветствую, ${ctx.update.message.from.first_name} !
Меня зовут Слим.
Я могу рассказать тебе о том, что происходит в футболе.
Чтобы узнать турнирное положение команд в чемпионате, введи текст в формате :
страна : таблица ( испания : таблица ).
Чтобы узнать лучших бомбардиров :
страна : бомбардиры ( англия : бомбардиры ).
Чтобы узнать о матчах : 
страна : матчи ( германия : матчи ).
Новости из мира спорта : /news
Список поддерживаемых стран : /help`);
});

TelegramBot.help((ctx) => {
	ctx.reply(`Список поддерживаемых стран :
Англия, Испания, Германия, Франция, Италия, 
Нидерланды,	Португалия,	Украина, Польша,
Казахстан, Беларусь, Россия, Турция, Швейцария,
Бельгия, Дания, Чехия, Австрия, Шотландия,
Греция`);
});

TelegramBot.hears('/news', async (ctx) => {
	let news = await parser.parserNews('https://terrikon.com/');
	ctx.reply(news);
});

TelegramBot.on('text', async (ctx) => {
	
	let userText = (ctx.update.message.text).toLowerCase();
	let objectOfCountries = {
		англия : 'england',
		испания : 'spain',
		германия : 'germany',
		италия : 'italy',
		франция : 'france',
		нидерланды : 'netherlands',
		португалия : 'portugal',
		украина : 'ukraine',
		польша : 'poland',
		казахстан : 'kazakhstan',
		беларусь : 'belarus',
		россия : 'russia',
		турция : 'turkey',
		швейцария : 'swiss',
		бельгия : 'belgium',
		дания : 'denmark',
		чехия : 'czech',
		австрия : 'austria',
		шотландия : 'scotland',
		греция : 'greece'
	};

	let greetingWords = ['привет','доброе утро','добрый день', 'добрый вечер','здравствуй','хай',
	'здравствуйте'];
	
	if ( greetingWords.includes(userText) ) {
		ctx.reply(`Приветики \ud83d\ude0e`);
		return;
	}

	if ( userText.includes('спасибо') ) {
		ctx.reply('\u263a\ufe0f');
		return;
	}

	if ( userText.includes(':') ) {
		let info = userText.match(/[а-я]+/gi);
		try {
			if ( objectOfCountries[info[0]] ) {
				if ( info[1] === 'таблица' ) {
					let data = await parser.parserTable(`https://terrikon.com/football/${objectOfCountries[info[0]]}/championship/`);
					ctx.reply(data);
				} else if ( info[1] === 'бомбардиры' ) {
					let data = await parser.parserStrikers(`https://terrikon.com/football/${objectOfCountries[info[0]]}/championship/strikers`);
					ctx.reply(data);
				} else if ( info[1] === 'матчи' ) {
					let data = await parser.parserMatches(`https://terrikon.com/football/${objectOfCountries[info[0]]}/championship/`);
					ctx.reply(data);
				} else {
					ctx.reply('Попробуй еще раз. Кажется, ты ввел неверные данные.')
				}
			} else ctx.reply('Попробуй что-то другое.');
		} 
		catch(err) {
			ctx.reply('Упс.. Произошла ошибка :(');
		}
	} else {
		ctx.reply(`Извини, но я не понимаю тебя.`);
	}
	
});


TelegramBot.launch();
