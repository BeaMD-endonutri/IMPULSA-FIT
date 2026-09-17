CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer NOT NULL,
	`bonus_id` integer NOT NULL,
	`starts_at` integer NOT NULL,
	`ends_at` integer NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`notes` text,
	`deducted_at` integer,
	`created_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bonus_id`) REFERENCES `bonuses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_appointments_starts_at` ON `appointments` (`starts_at`);--> statement-breakpoint
CREATE INDEX `idx_appointments_client_id` ON `appointments` (`client_id`);--> statement-breakpoint
CREATE INDEX `idx_appointments_status_starts_at` ON `appointments` (`status`,`starts_at`);--> statement-breakpoint
ALTER TABLE `bonus_movements` ADD `appointment_id` integer;