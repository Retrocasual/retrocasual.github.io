((obj) => {  // Настройка  анимации
	obj = obj || window;

	// elem - элемент для анимации , prop - параметры анимации, начало и старт, значения стилей, шаг
	obj.animation = function(elem, prop, cb) { 
		const count = prop.count;
		let counter = 0
		if (prop.start) {
			prop.start.forEach(item => {
				elem.style[item[0]] = item[1]
			})
		}

		const allAnimation = []; // Массив, содержащий все параметры анимаций

		prop.anim.forEach(([style, from, to]) => {
			const max = Math.max(from, to);
			const min = Math.min(from, to);
			const step = (max - min) / count;
			allAnimation.push({style, from, to, step, reverse: min === to})
		});


		const rafAnimation = () => { // Цикл, где меняются значения стилей элемента

			allAnimation.forEach((item) => {
				if (item.reverse) {
					item.from -= item.step
				} else {
					item.from += item.step
				}

				elem.style[item.style] = item.from;
			})

			counter++; // счетчик увеличивается за каждое изменение стиля
			if (counter < count) { // пока счетчик не достиг конечного значения (кол-во параметров prop)

				requestAnimationFrame(rafAnimation); // Запрашивается следующий кадр/шаг анимации и цикл продолжается
			} else {
				if (prop.end) {
					prop.end.forEach(item => {
						elem.style[item[0]] = item[1]
					})
				}
				if (cb) cb();
			}


		}
		requestAnimationFrame(rafAnimation);
	};
})();


const init = () => { // При загрузке страницы/документа

	const overlay = document.createElement('div'); // создание див для модального окна 
	overlay.className = 'videotube-modal-overlay' //  добавление свойств окна, которые записаны в отдельном CSS файле
	document.body.insertAdjacentElement('beforeend', overlay); // добавление этого контейнера (div) в конец HTML

	const video = document.createElement('div'); // создание див контейнера, которое будет содержать видео с ютуба
	video.id = 'videotube-modal-container'

	const sizeBlockList = [ // Спиоск размеров видео (ширина и высота) для конкретного разрешения экрана
		[3840, 2160],
		[2560, 1440],
		[1920, 1080],
		[1280, 720],
		[854, 420],
		[640, 360],
		[426, 240]
	];


	const sizeVideo = () => { // Устанавливает размер видео в зависимости от текущего разрешения экрана
		const sizeBlock = sizeBlockList.find(item => item[0] < window.visualViewport.width) ||
			sizeBlockList[sizeBlockList.length - 1];

		const iframe = document.getElementById('videotube-modal');
		iframe.width = sizeBlock[0];
		iframe.height = sizeBlock[1];
		video.style.cssText = `
			width: ${sizeBlock[0]};
			height: ${sizeBlock[1]};
		`;

	}

	const sizeContainer = () => { // Устанавливает размер контейнера видео и позиционирует его в центре экрана

		const wh = window.visualViewport.height;
		const ww = window.visualViewport.width;
		const fw = video.style.width;
		const fh = video.style.height;

		video.style.left = (ww - fw) / 2;
		video.style.top = (wh - fh) / 2;
		overlay.style.height = document.documentElement.clientHeight;
	}

	const sizeVideoTubeModal = () => { // Вызывает две верхние функции
		sizeContainer();
		sizeVideo();
	}

	const closeVideoTubeModal = () => { // Анимация закрытия модального окна, удаление содержимого

		animation(overlay, {
				end: [['display', 'none']],
				anim: [['opacity', 1, 0]],
				count: 20,
			},
			() => {
				overlay.textContent = "";
			}
		);
		window.removeEventListener("optimizedResize", sizeVideoTubeModal);
		document.removeEventListener('keyup', closeContainerEsc);
	}

	const closeContainerEsc = e => { //  Вызывает функцию закрытия при нажатии Esc
		if (e.keyCode === 27) {
			closeVideoTubeModal();
		}
	}


	const openVideoTubeModal = e => {  // Открытие модального окна при клике на картинку в слайдере
			const target = e.target.closest('.tube');
			if (!target) return;

			const href = target.href;
			const search = href.includes('youtube');

			// Извлечение индентификатора видео из ссылки на которую кликнули
			let idVideo = search ? href.match(/(\?|&)v=([^&]+)/)[2] : href.match(/(\.be\/)([^&]+)/)[2]; 

			if (idVideo.length === 0) return;

			e.preventDefault(); // Отмена действия по умолчанию для клика (открытие видео в ютубе)

			animation(overlay, { // Анимация открытия модального окна
					start: [['display', 'block']],
					anim: [['opacity', 0, 1]],
					count: 20,
				}
			);

			// iframe - тег для встраивания видео с платформы YouTube 
			overlay.insertAdjacentHTML('beforeend', `   
			<div id="videotube-modal-loading">Loading...</div>
			<div id="videotube-modal-close">&#10006;</div>
			<div id="videotube-modal-container">
				<iframe src="https://youtube.com/embed/${idVideo}?autoplay=1" 
					frameborder="0"
					id="videotube-modal" 
					allowfullscreen
					allow="autoplay">
				</iframe>
			</div>
		`)

			sizeVideo(); // Вызов функций для установки размеров
			sizeContainer();

			// 
			window.addEventListener("optimizedResize", sizeVideoTubeModal);
			document.addEventListener('keyup', closeContainerEsc);
		}
	;


	overlay.addEventListener("click", closeVideoTubeModal); // Вызывание события при клике
	document.addEventListener('click', openVideoTubeModal) // Вызывание события при клике

}

document.addEventListener('DOMContentLoaded', init)
