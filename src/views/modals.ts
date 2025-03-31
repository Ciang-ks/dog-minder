import { Modal, App } from "obsidian";

export class TimeReachModal extends Modal {
	gifPath: string;
	title: string;
	message: string;

	constructor(app: App, gifPath: string, title: string, message: string) {
		super(app);
		this.gifPath = gifPath;
		this.title = title;
		this.message = message;
		this.setTitle(message);
	}

	onOpen() {
		this.modalEl.addClass("modal-container-dog");

		const { contentEl } = this;
		contentEl.addClass("modal-content-dog");

		const img = contentEl.createEl("img");
		img.src = this.gifPath;
		img.alt = "GO!";
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
