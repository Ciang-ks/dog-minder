import { moment } from "obsidian";

export function isValidTimeFormat(value: string): boolean {
	return moment(value, "HH:mm", true).isValid();
}

export function  isValidDateFormat(value: string): boolean {
	return moment(value, "YYYY-MM-DD", true).isValid();
}

export function formatTime(value: string): string {
	return moment(value, "HH:mm").format("HH:mm");
}

export function formatDate(value: string): string {
	return moment(value, "YYYY-MM-DD").format("YYYY-MM-DD");
}