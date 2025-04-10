export interface UsageStats {
	lastDate: string;
	todayUsage: number;
	lastActive: number;
	isActive: boolean;
}

export interface Reminder {
	enabled: boolean;
	hasTriggered: boolean;
	times: string[];
	title: string;
	message: string;
	gifPath: string;
}

export interface DogPluginSettings {
	mySetting: string;
	usageStats: UsageStats;
	reminders: Record<string, Reminder>;
	enableAnniversary: boolean;
	anniversaryEvent: string;
	anniversaryDate: string;
}

export const DEFAULT_SETTINGS: DogPluginSettings = {
	mySetting: "default",
	usageStats: {
		lastDate: "",
		todayUsage: 0,
		lastActive: 0,
		isActive: false,
	},
	reminders: {
		eating: {
			enabled: false,
			hasTriggered: false,
			times: ["11:40", "18:20"],
			title: "吃饭提醒",
			message: "吃吃吃!!!",
			gifPath: "/assets/gif/to_eat_dog.gif",
		},
		exercise: {
			enabled: false,
			hasTriggered: false,
			times: ["21:00"],
			title: "运动提醒",
			message: "🏃‍♂️🏃‍♂️🏃‍♂️💪💪💪",
			gifPath: "/assets/gif/training_dog.gif",
		},
		sleep: {
			enabled: false,
			hasTriggered: false,
			times: ["23:00"],
			title: "睡觉提醒",
			message: "睡睡睡!!!",
			gifPath: "/assets/gif/to_sleep_dog.gif",
		},
		other1: {
			enabled: false,
			hasTriggered: false,
			times: ["15:00"],
			title: "其他提醒1",
			message: "🥰🥰🥰",
			gifPath: "/assets/gif/love_dog.gif",
		},
		other2: {
			enabled: false,
			hasTriggered: false,
			times: ["17:00"],
			title: "其他提醒2",
			message: "🥳🥳🥳",
			gifPath: "/assets/gif/cele_dog.gif",
		},
		other3: {
			enabled: false,
			hasTriggered: false,
			times: ["19:00"],
			title: "其他提醒3",
			message: "😘😘😘",
			gifPath: "/assets/gif/hello_dog.gif",
		},
	},
	enableAnniversary: false,
	anniversaryEvent: "",
	anniversaryDate: "",
};
