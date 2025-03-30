import { Plugin, Notice, addIcon, MarkdownView } from "obsidian";
import { DEFAULT_SETTINGS, DogPluginSettings } from "./settings";
import { UsageTracker } from "./modules/usage-tracker";
import { DogRunner } from "./modules/dog-runner";
import { ReminderManager } from "./modules/reminder-manager";
import { SettingTab } from "./views/setting-tab";

export default class DogPlugin extends Plugin {
	settings: DogPluginSettings;
	usageTracker: UsageTracker;
	dogRunner: DogRunner;
	reminderManager: ReminderManager;

	async onload() {
		await this.loadSettings();
		addIcon(
			"x_dog",
			`<circle cx="50" cy="50" r="45" fill="white" stroke="white" stroke-width="10"/>
		  <circle cx="30" cy="42" r="5" fill="black"/>
		  <circle cx="70" cy="42" r="5" fill="black"/>
		  <ellipse cx="50" cy="46" rx="8" ry="6" fill="black"/>
		  <line x1="50" y1="46" x2="50" y2="60" stroke="black" stroke-width="5"/>
		  <path d="M25 58 c 5 6 12 6 24 0"  stroke="black" stroke-width="5"/>
		  <path d="M75 58 c -5 6 -12 6 -24 0" stroke="black" stroke-width="5"/>
		  <path d="M35 62.5 C 41.5 80 58.5 80 65 62.5" fill="red" stroke="black" stroke-width="5"/>`
		);

		const item = this.addStatusBarItem();
		const status_gifPath = this.app.vault.adapter.getResourcePath(
			this.manifest.dir + "/assets/gif/nodding_dog.gif"
		);
		console.log("Status GIF path:", status_gifPath);

		const img = item.createEl("img");
		img.src = status_gifPath;
		img.alt = "Dog nodding gif";
		img.style.width = "auto";
		img.style.height = "20px";
		img.addClass("status-bar-dog-gif");
		img.addEventListener("click", () => {
			let usageMinute = Math.floor(
				this.settings.usageStats.todayUsage / 1000 / 60
			);
			const usageHour = Math.floor(usageMinute / 60);
			usageMinute = usageMinute % 60;
			if (usageHour > 0) {
				new Notice(`今天在这呆了${usageHour}小时${usageMinute}分钟啦`);
			} else if (usageMinute > 0) {
				new Notice(`今天在这呆了${usageMinute}分钟啦`);
			} else {
				new Notice(`美好的一天刚刚开始!`);
			}
		});

		this.usageTracker = new UsageTracker(this);
		this.usageTracker.initialize();

		this.dogRunner = new DogRunner(this);

		const ribbonIconEl = this.addRibbonIcon("x_dog", "Minder", () => {
			let count = 0;
			const intervalId = setInterval(() => {
				this.dogRunner.createRunningDog();
				count++;
				if (count >= 1) {
					clearInterval(intervalId);
				}
			}, 200);
		});
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		const addFullLayer = () => {
			const activeView =
				this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				new Notice("No active Markdown view found.");
				return;
			}
			const editor = activeView.containerEl;

			const overlay = document.createElement("div");
			overlay.style.position = "absolute";
			overlay.style.top = "0";
			overlay.style.left = "0";
			overlay.style.width = "100%";
			overlay.style.height = "100%";
			overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
			overlay.style.zIndex = "9998";
			overlay.style.display = "flex";
			overlay.style.justifyContent = "center";
			overlay.style.alignItems = "center";
			overlay.style.paddingTop = "20px";
			overlay.style.paddingBottom = "20px";
			overlay.style.overflow = "auto";

			const img = document.createElement("img");
			img.src = this.app.vault.adapter.getResourcePath(
				this.manifest.dir + "/assets/gif/background_dog_alt.gif"
			);
			img.alt = "Relaxing Dog";
			img.style.width = "85%";
			img.style.height = "auto";
			img.style.borderRadius = "40px";
			overlay.appendChild(img);

			editor.appendChild(overlay);
			img.onload = () => {
				overlay.scrollTop =
					((overlay.scrollHeight - overlay.clientHeight) * 2) / 3;
			};
			overlay.addEventListener("click", () => {
				if (overlay) {
					overlay.remove();
				}
			});
			const actKeydown = (event: KeyboardEvent): void => {
				if (event.key === "Escape") {
					if (overlay) {
						overlay.remove();
						document.removeEventListener("keydown", actKeydown);
					}
				}
			};
			document.addEventListener("keydown", actKeydown);
		};

		const addSideGif = () => {
			const activeView =
				this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				new Notice("No active Markdown view found.");
				return;
			}
			const editor = activeView.containerEl;

			const container = document.createElement("div");
			container.style.position = "absolute";
			container.style.bottom = "35px";
			container.style.right = "0";
			container.style.width = "30%";
			container.style.height = "auto";
			container.style.backgroundColor = "rgba(0, 0, 0, 0)";
			container.style.zIndex = "1000";
			container.style.display = "flex";
			container.style.justifyContent = "center";
			container.style.alignItems = "flex-start";
			container.style.paddingRight = "12px";
			container.style.overflow = "auto";

			const img = document.createElement("img");
			img.src = this.app.vault.adapter.getResourcePath(
				this.manifest.dir + "/assets/gif/codding_dog.gif"
			);
			img.alt = "Coding Dog";
			img.style.width = "100%";
			img.style.height = "auto";
			img.style.borderRadius = "20px";
			container.appendChild(img);

			editor.appendChild(container);

			new Notice("两个人的生活吗?");
			container.addEventListener("click", () => {
				if (container) {
					container.remove();
				}
			});
		};
		this.addCommand({
			id: "relax-with-dog",
			name: "relax with dog",
			callback: addFullLayer,
		});

		this.addCommand({
			id: "code-with-dog",
			name: "code with dog",
			callback: addSideGif,
		});

		this.addSettingTab(new SettingTab(this.app, this));

		this.reminderManager = new ReminderManager(this);
		this.reminderManager.startReminderCheck();
	}

	onunload() {
		if (this.usageTracker) this.usageTracker.cleanup();
		if (this.dogRunner) this.dogRunner.cleanup();
		if (this.reminderManager) this.reminderManager.stopReminderCheck();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
