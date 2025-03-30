import DogPlugin from "../main";

export class DogRunner {
	plugin: DogPlugin;
	dogElements: Array<{ element: HTMLElement; timeout: number }>;

	constructor(plugin: DogPlugin) {
		this.plugin = plugin;
		this.dogElements = [];
	}

	createRunningDog() {
		if (!this.dogElements) this.dogElements = [];

		const dogGifElement = document.createElement("div");
		dogGifElement.addClass("dog-gif-container");
		dogGifElement.addClass("running-dog");

		dogGifElement.style.position = "fixed";
		dogGifElement.style.top = `calc(max(${
			Math.random() * 100
		}vh - 120px, -20px))`;
		dogGifElement.style.zIndex = "9999";

		let gifPath = this.plugin.manifest.dir + "/assets/gif/";
		let width = 110;
		if (Math.floor(Math.random() * 5) % 5 === 4) {
			gifPath += "double_running_dog.gif";
			width = 180;
		} else {
			gifPath += "running_dog.gif";
		}
		const img = document.createElement("img");
		img.src = this.plugin.app.vault.adapter.getResourcePath(gifPath);
		img.alt = "Dog running gif";
		img.style.width = `${width}px`;
		img.style.height = "auto";

		dogGifElement.appendChild(img);
		document.body.appendChild(dogGifElement);

		const timeout = setTimeout(() => {
			dogGifElement.remove();
		}, 10000) as unknown as number;

		this.dogElements.push({
			element: dogGifElement,
			timeout: timeout,
		});
	}

	cleanup() {
		if (this.dogElements) {
			this.dogElements.forEach(({ element, timeout }) => {
				clearTimeout(timeout);
				element.remove();
			});
		}
		this.dogElements = [];
	}
}
