import { moment } from "obsidian";

export function isValidTimeFormat(value: string): boolean {
	return moment(value, "HH:mm", true).isValid();
}

export function formatTime(value: string): string {
	return moment(value, "HH:mm").format("HH:mm");
}
