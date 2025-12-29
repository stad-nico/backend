import { Migration } from '@mikro-orm/migrations';

export class Migration20251218183613 extends Migration {
	public override async up(): Promise<void> {
		this.addSql(`alter table \`files\` drop foreign key \`files_userId_foreign\`;`);

		this.addSql(`alter table \`users\` drop index \`users_id_unique\`;`);
		this.addSql(`alter table \`users\` drop primary key;`);

		this.addSql(`alter table \`users\` add primary key \`users_pkey\`(\`id\`);`);

		this.addSql(`alter table \`files\` drop index \`files_userId_index\`;`);

		this.addSql(`alter table \`files\` change \`userId\` \`user\` varchar(36) not null;`);
		this.addSql(
			`alter table \`files\` add constraint \`files_user_foreign\` foreign key (\`user\`) references \`users\` (\`id\`) on update no action on delete cascade;`
		);
		this.addSql(`alter table \`files\` add index \`files_user_index\`(\`user\`);`);

		this.addSql(`alter table \`files\` drop foreign key \`files_user_foreign\`;`);

		this.addSql(`alter table \`files\` drop index \`files_user_index\`;`);

		this.addSql(`alter table \`files\` change \`user\` \`userId\` varchar(36) not null;`);
		this.addSql(
			`alter table \`files\` add constraint \`files_userId_foreign\` foreign key (\`userId\`) references \`users\` (\`id\`) on update no action on delete cascade;`
		);
		this.addSql(`alter table \`files\` add index \`files_userId_index\`(\`userId\`);`);
	}

	public override async down(): Promise<void> {
		this.addSql(`alter table \`files\` drop foreign key \`files_user_foreign\`;`);

		this.addSql(`alter table \`files\` drop index \`files_user_index\`;`);

		this.addSql(`alter table \`files\` change \`user\` \`userId\` varchar(36) not null;`);
		this.addSql(
			`alter table \`files\` add constraint \`files_userId_foreign\` foreign key (\`userId\`) references \`users\` (\`id\`) on update no action on delete cascade;`
		);
		this.addSql(`alter table \`files\` add index \`files_userId_index\`(\`userId\`);`);

		this.addSql(`alter table \`users\` drop primary key;`);

		this.addSql(`alter table \`users\` add unique \`users_id_unique\`(\`id\`);`);
		this.addSql(`alter table \`users\` add primary key \`users_pkey\`(\`id\`, \`username\`);`);

		this.addSql(`alter table \`files\` drop foreign key \`files_userId_foreign\`;`);

		this.addSql(`alter table \`files\` drop index \`files_userId_index\`;`);

		this.addSql(`alter table \`files\` change \`userId\` \`user\` varchar(36) not null;`);
		this.addSql(
			`alter table \`files\` add constraint \`files_user_foreign\` foreign key (\`user\`) references \`users\` (\`id\`) on update no action on delete cascade;`
		);
		this.addSql(`alter table \`files\` add index \`files_user_index\`(\`user\`);`);
	}
}
