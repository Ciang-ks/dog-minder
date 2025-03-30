import { PluginSettingTab, Setting, Notice, App } from "obsidian";
import DogPlugin from "../main";
import { isValidTimeFormat, formatTime } from "../utils/time-utils";

export class SettingTab extends PluginSettingTab {
	plugin: DogPlugin;
	constructor(app: App, plugin: DogPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h1", { text: "日常提醒设置" });

		// 遍历所有提醒类型
		for (const [reminderKey, reminder] of Object.entries(
			this.plugin.settings.reminders
		)) {
			const reminderContainer = containerEl.createDiv();
			reminderContainer.addClass("reminder-container");

			// 添加标题
			reminderContainer.createEl("h1", { text: reminder.title });

			// 启用/禁用开关
			new Setting(reminderContainer)
				.setName(`启用${reminder.title}`)
				.setDesc(`是否开启${reminder.title}`)
				.addToggle((toggle) => {
					toggle
						.setValue(reminder.enabled)
						.onChange(async (value) => {
							reminder.enabled = value;
							await this.plugin.saveSettings();
							this.display();
						});
				});

			if (reminder.enabled) {
				// 现有时间点列表
				const timesContainer = reminderContainer.createDiv();
				timesContainer.addClass("times-container");

				// 显示现有的时间点
				reminder.times.forEach((time, index) => {
					new Setting(timesContainer)
						.setName(`时间 ${index + 1}`)
						.addMomentFormat((format) => {
							format
								.setPlaceholder("例如 12:30")
								.setValue(time)
								.onChange(async (value) => {
									reminder.times[index] = value;
								});

							const inputEl = format.inputEl;
							inputEl.addEventListener(
								"keydown",
								async (event) => {
									if (event.key === "Enter") {
										const value = inputEl.value;
										if (!isValidTimeFormat(value)) {
											new Notice(
												"请输入有效的时间格式, 如 05:30"
											);
											return;
										}
										const formattedTime = formatTime(value);
										reminder.times[index] = formattedTime;
										reminder.hasTriggered = false;
										await this.plugin.saveSettings();

										inputEl.value = formattedTime;
										inputEl.blur();
									}
								}
							);
						})
						.addExtraButton((button) => {
							button
								.setIcon("trash")
								.setTooltip("删除")
								.onClick(async () => {
									reminder.times.splice(index, 1);
									await this.plugin.saveSettings();
									this.display();
								});
						});
				});
				// 添加新时间点的按钮
				new Setting(timesContainer)
					.setName("添加新时间")
					.addButton((button) => {
						button.setButtonText("添加").onClick(async () => {
							reminder.times.push("12:00");
							await this.plugin.saveSettings();
							this.display();
						});
					});

				// 提醒消息设置
				new Setting(reminderContainer)
					.setName("提醒消息")
					.setDesc("设置提醒显示的消息")
					.addText((text) => {
						text.setPlaceholder("例如：该吃饭啦！")
							.setValue(reminder.message)
							.onChange(async (value) => {
								reminder.message = value;
								await this.plugin.saveSettings();
							});
					});
			}

			// 添加分隔线
			if (
				reminderKey !==
				Object.keys(this.plugin.settings.reminders).pop()
			) {
				reminderContainer.createEl("hr");
			}
		}
	}
}
