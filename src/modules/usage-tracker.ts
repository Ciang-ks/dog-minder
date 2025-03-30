import { moment } from "obsidian";
import DogPlugin from "../main";

export class UsageTracker {
	plugin: DogPlugin;

	constructor(plugin: DogPlugin) {
		this.plugin = plugin;
	}

	initialize() {
		const currentDate = moment().format("YYYY-MM-DD");
		const lastDate = this.plugin.settings.usageStats.lastDate;
		if (lastDate !== currentDate) {
			if (lastDate !== "") {
				this.saveUsageLog(
					lastDate,
					this.plugin.settings.usageStats.todayUsage
				)
			}
			this.plugin.settings.usageStats.lastDate = currentDate;
			this.plugin.settings.usageStats.todayUsage = 0;
			this.plugin.saveSettings();
		}
		this.plugin.settings.usageStats.isActive = true;
		this.plugin.settings.usageStats.lastActive = Date.now();
		this.plugin.registerDomEvent(
			document,
			"mousemove",
			this.handleUserActivity.bind(this)
		);
		this.plugin.registerDomEvent(
			document,
			"keydown",
			this.handleUserActivity.bind(this)
		);
		this.plugin.registerDomEvent(
			document,
			"scroll",
			this.handleUserActivity.bind(this)
		);


		this.plugin.registerInterval(
			window.setInterval(() => {
				console.log("Updating usage time...");
				this.updateUsageTime();
			}, 100 * 60)
		);

		window.addEventListener("blur", this.handleAppInactive.bind(this));
		window.addEventListener("focus", this.handleAppActive.bind(this));
	}

	handleUserActivity() {
		const now = Date.now();
		const elapsedTime = now - this.plugin.settings.usageStats.lastActive;

		if (elapsedTime > 2 * 1000 * 60) {
			this.plugin.settings.usageStats.lastActive = now;
		} else if (!this.plugin.settings.usageStats.isActive) {
			this.plugin.settings.usageStats.isActive = true;
			this.plugin.settings.usageStats.lastActive = now;
			this.plugin.saveSettings();
		}
	}

	handleAppInactive() {
		if (this.plugin.settings.usageStats.isActive) {
			this.plugin.settings.usageStats.isActive = false;
			this.plugin.saveSettings();
		}
	}

	handleAppActive() {
		if (!this.plugin.settings.usageStats.isActive) {
			this.plugin.settings.usageStats.isActive = true;
			this.plugin.settings.usageStats.lastActive = Date.now();
			this.plugin.saveSettings();
		}
	}

	updateUsageTime() {
		if (this.plugin.settings.usageStats.isActive) {
			const now = Date.now();
			const elapsedTime =
				now - this.plugin.settings.usageStats.lastActive;

			if (elapsedTime > 2 * 1000 * 60) {
				this.plugin.settings.usageStats.isActive = false;
				this.plugin.settings.usageStats.lastActive = now;
				return;
			}
			this.plugin.settings.usageStats.todayUsage += elapsedTime;
			this.plugin.settings.usageStats.lastActive = now;

			this.plugin.saveSettings();
		}
	}

	async saveUsageLog(date: string, usageTime: number) {
		try {
			const usageMinutes = Math.floor(usageTime / 1000 / 60);
			const usageHours = Math.floor(usageMinutes / 60);
			const remainingMinutes = usageMinutes % 60;
			
			let usageString = ""
			if (usageHours > 0) {
				usageString = `${usageHours}h ${remainingMinutes}m`;
			}
			else if (remainingMinutes > 0) {
				usageString = `${remainingMinutes}m`;
			}

			const logEntry = `${date}: ${usageString}`;
			const logFile = `${this.plugin.manifest.dir}/usage.log`;

			const adapter = this.plugin.app.vault.adapter;

			let fileContent = "";
			if (await adapter.exists(logFile)) {
				fileContent = await adapter.read(logFile);
			} else {
				fileContent = "Dog Minder 使用日志\n\n";
			}

			await adapter.write(logFile, fileContent + logEntry + "\n");
			console.log("日志已更新")
		} catch(error) {
			console.error("保存日志失败", error)
		}
	} 

	cleanup() {
		this.updateUsageTime();
		window.removeEventListener("blur", this.handleAppInactive);
		window.removeEventListener("focus", this.handleAppActive);
		this.plugin.settings.usageStats.isActive = false;
	}
}
