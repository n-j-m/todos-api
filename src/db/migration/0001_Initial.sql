-- Migration number: 0001 	 2024-05-10T20:33:15.640Z
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todo_lists` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owner_id` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`done` integer DEFAULT false NOT NULL,
	`owner_id` text NOT NULL,
	`list_id` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`list_id`) REFERENCES `todo_lists`(`id`) ON UPDATE no action ON DELETE no action
);

