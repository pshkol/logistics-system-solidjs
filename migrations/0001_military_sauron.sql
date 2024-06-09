CREATE TABLE `payment_to_driver` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`amount` real NOT NULL,
	`debt_to_driver_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `driver`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`debt_to_driver_id`) REFERENCES `debt_to_driver`(`id`) ON UPDATE no action ON DELETE no action
);
