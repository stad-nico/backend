import { Migration } from '@mikro-orm/migrations';

export class Migration20260106154122 extends Migration {
	public override async up(): Promise<void> {
		this.addSql(
			`create table \`todos\` (\`id\` varchar(36) not null default UUID(), \`title\` varchar(255) not null, \`description\` varchar(255) null default null, \`createdAt\` datetime not null default current_timestamp(), \`completedAt\` datetime null default null, \`dueBy\` datetime null default null, \`status\` enum('pending', 'completed') not null default 'pending', \`userId\` varchar(36) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`
		);
		this.addSql(`alter table \`todos\` add index \`todos_userId_index\`(\`userId\`);`);

		this.addSql(
			`alter table \`todos\` add constraint \`todos_userId_foreign\` foreign key (\`userId\`) references \`users\` (\`id\`) on update no action on delete cascade;`
		);
	}

	public override async down(): Promise<void> {
		this.addSql(`drop table if exists \`todos\`;`);
	}
}
