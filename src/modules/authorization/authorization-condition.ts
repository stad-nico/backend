export type AuthorizationCondition<Context> = (context: Context) => Promise<boolean>;
