import { moment } from "obsidian";
import DogPlugin from "../main";
import { TimeReachModal } from "../views/modals";

export class ReminderManager {
	plugin: DogPlugin;
	intervalId: number | undefined;

	constructor(plugin: DogPlugin) {
		this.plugin = plugin;
	}

	startReminderCheck() {
		this.intervalId = window.setInterval(() => {
			const currentTime = moment().format("HH:mm");

			// 遍历所有提醒类型
			for (const [reminderKey, reminder] of Object.entries(
				this.plugin.settings.reminders
			)) {
				if (!reminder.enabled) continue;

				// 检查当前时间是否匹配任何时间点
				const matchedTime = reminder.times.includes(currentTime);

				if (matchedTime) {
					if (!reminder.hasTriggered) {
						// 创建提醒模态框
						console.log(
							"Creating reminder modal for:",
							reminderKey
						);
						new TimeReachModal(
							this.plugin.app,
							this.plugin.app.vault.adapter.getResourcePath(
								this.plugin.manifest.dir + reminder.gifPath
							),
							reminder.title,
							reminder.message
						).open();

						reminder.hasTriggered = true;
						this.plugin.saveSettings();
					}
				} else {
					// 如果当前时间不匹配任何时间点，重置 hasTriggered
					if (reminder.hasTriggered) {
						reminder.hasTriggered = false;
						this.plugin.saveSettings();
					}
				}
			}
		}, 10000);
	}

	stopReminderCheck() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	}
}
