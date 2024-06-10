CREATE TABLE `client_payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer NOT NULL,
	`amount` real NOT NULL,
	`client_debt_id` integer,
	`payment_date` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_debt_id`) REFERENCES `client_debt`(`id`) ON UPDATE no action ON DELETE no action
);
